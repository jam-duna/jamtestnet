package jamnp

import (
	"context"
	"crypto/ed25519"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"encoding/binary"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
	"net"
	"sync"
	"time"

	"github.com/quic-go/quic-go"
)

const (
	UP0_BlockAnnouncement       byte = 0
	CE128_BlockRequest          byte = 128
	CE129_StateRequest          byte = 129
	CE131_TicketDistribution    byte = 131
	CE132_TicketDistributionP   byte = 132
	CE133_WorkPackageSubmission byte = 133
	// ...
)

const (
	numNodes = 6
	quicAddr = "127.0.0.1:%d"
)

type Ed25519Priv ed25519.PrivateKey

type Validator struct {
	Ed25519 ed25519.PublicKey `json:"ed25519"`
}

type ValidatorSecret struct {
	Ed25519Pub    [32]byte
	Ed25519Secret [64]byte
}

func generateSelfSignedCert(ed25519Pub ed25519.PublicKey, ed25519Priv ed25519.PrivateKey) (tls.Certificate, error) {
	fmt.Printf("%x %x \n", ed25519Pub, ed25519Priv)
	template := x509.Certificate{
		SerialNumber: big.NewInt(1),
		NotBefore:    time.Now(),
		NotAfter:     time.Now().Add(365 * 24 * time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature,
		ExtKeyUsage: []x509.ExtKeyUsage{
			x509.ExtKeyUsageServerAuth,
		},
		IPAddresses: []net.IP{net.ParseIP("127.0.0.1")},
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, ed25519Pub, ed25519Priv)
	if err != nil {
		fmt.Printf("XXX %v", err)
		return tls.Certificate{}, err
	}

	certPEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
	privKeyBytes, err := x509.MarshalPKCS8PrivateKey(ed25519Priv)
	if err != nil {
		fmt.Printf("yyy %v", err)
		return tls.Certificate{}, err
	}
	privKeyPEM := pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: privKeyBytes})

	return tls.X509KeyPair(certPEM, privKeyPEM)

}

func InitEd25519Key(seed []byte) (ed25519.PublicKey, ed25519.PrivateKey, error) {
	if len(seed) != ed25519.SeedSize {
		return nil, nil, errors.New("seed must be 32 bytes long")
	}

	// Generate the private key from the seed
	privateKey := ed25519.NewKeyFromSeed(seed)
	publicKey := privateKey.Public().(ed25519.PublicKey)

	return publicKey, privateKey, nil
}

func GenerateQuicConfig() *quic.Config {
	return &quic.Config{
		Allow0RTT:       true,
		KeepAlivePeriod: time.Minute,
	}
}

func InitValidator(ed25519_seed []byte) (Validator, error) {
	validator := Validator{}
	ed25519_pub, _, err := InitEd25519Key(ed25519_seed)
	if err != nil {
		return validator, fmt.Errorf("Failed to init Ed25519 Key")
	}
	validator.Ed25519 = ed25519_pub
	return validator, nil
}

func InitValidatorSecret(ed25519_seed []byte) (ValidatorSecret, error) {
	validatorSecret := ValidatorSecret{}
	ed25519_pub, ed25519_priv, err := InitEd25519Key(ed25519_seed)
	if err != nil {
		return validatorSecret, fmt.Errorf("Failed to init Ed25519 Key")
	}
	copy(validatorSecret.Ed25519Secret[:], ed25519_priv[:])
	copy(validatorSecret.Ed25519Pub[:], ed25519_pub[:])
	return validatorSecret, nil
}

type Node struct {
	id             uint16
	credential     ValidatorSecret
	peersInfo      map[uint16]*Peer
	peersInfoMutex sync.RWMutex
	server         quic.Listener
	tlsConfig      *tls.Config
	clients        map[string]string
	clientsMutex   sync.RWMutex
}

func NewNode(id uint16, credential ValidatorSecret, startPeerList map[uint16]*Peer, port int) (*Node, error) {
	addr := fmt.Sprintf("0.0.0.0:%d", port)
	ed25519_priv := ed25519.PrivateKey(credential.Ed25519Secret[:])
	ed25519_pub := ed25519_priv.Public().(ed25519.PublicKey)
	cert, err := generateSelfSignedCert(ed25519_pub, ed25519_priv)
	if err != nil {
		return nil, fmt.Errorf("Error generating self-signed certificate: %v", err)
	}

	node := &Node{
		id:         id,
		credential: credential,
		clients:    make(map[string]string),
		peersInfo:  make(map[uint16]*Peer),
	}

	tlsConfig := &tls.Config{
		Certificates:       []tls.Certificate{cert},
		ClientAuth:         tls.RequireAnyClientCert,
		InsecureSkipVerify: true,
		GetConfigForClient: func(info *tls.ClientHelloInfo) (*tls.Config, error) {
			return &tls.Config{
				Certificates:       []tls.Certificate{cert},
				ClientAuth:         tls.RequireAnyClientCert,
				InsecureSkipVerify: true,
				VerifyPeerCertificate: func(rawCerts [][]byte, verifiedChains [][]*x509.Certificate) error {
					if len(rawCerts) == 0 {
						return fmt.Errorf("no client certificate provided")
					}
					cert, err := x509.ParseCertificate(rawCerts[0])
					if err != nil {
						return fmt.Errorf("failed to parse client certificate: %v", err)
					}
					pubKey, ok := cert.PublicKey.(ed25519.PublicKey)
					if !ok {
						return fmt.Errorf("client public key is not Ed25519")
					}
					node.clientsMutex.Lock()
					node.clients[info.Conn.RemoteAddr().String()] = hex.EncodeToString(pubKey)
					node.clientsMutex.Unlock()
					//fmt.Printf("Client Ed25519 Public Key: %x %s\n", pubKey, info.Conn.RemoteAddr())
					return nil
				},
				NextProtos: []string{"h3", "http/1.1", "ping/1.1"},
			}, nil
		},
		NextProtos: []string{"h3", "http/1.1", "ping/1.1"},
	}
	node.tlsConfig = tlsConfig

	listener, err := quic.ListenAddr(addr, tlsConfig, GenerateQuicConfig())
	if err != nil {
		return nil, fmt.Errorf("Error starting QUIC listener: %v", err)
	}
	node.server = *listener

	for validatorIndex, p := range startPeerList {
		node.peersInfo[validatorIndex] = NewPeer(node, validatorIndex, p.Validator, p.PeerAddr)
	}

	go node.runServer()
	go node.runClient()
	return node, nil
}

func (n *Node) lookupPubKey(pubKey string) (uint16, bool) {
	n.peersInfoMutex.RLock()
	defer n.peersInfoMutex.RUnlock()
	for validatorIndex, peer := range n.peersInfo {
		if hex.EncodeToString(peer.Validator.Ed25519) == pubKey {
			return validatorIndex, true
		}
	}
	return 0, false
}

func (n *Node) handleConnection(conn quic.Connection) {
	remoteAddr := conn.RemoteAddr().String()

	n.clientsMutex.RLock()
	pubKey, ok := n.clients[remoteAddr]
	n.clientsMutex.RUnlock()
	if !ok {
		fmt.Printf("handleConnection: UNKNOWN remoteAddr=%s\n", remoteAddr)
		return
	}

	validatorIndex, ok := n.lookupPubKey(pubKey)
	if !ok {
		fmt.Printf("handleConnection: UNKNOWN pubkey %s from remoteAddr=%s\n", pubKey, remoteAddr)
		return
	}

	for {
		stream, err := conn.AcceptStream(context.Background())
		if err != nil {
			fmt.Printf("handleConnection: Accept stream error: %v\n", err)
			return
		}
		go n.DispatchIncomingQUICStream(stream, validatorIndex)
	}
}

func (n *Node) runServer() {
	for {
		conn, err := n.server.Accept(context.Background())
		if err != nil {
			fmt.Printf("runServer: Server accept error: %v\n", err)
			continue
		}
		go n.handleConnection(conn)
	}
}

func (n *Node) runClient() {

	ticker_pulse := time.NewTicker(1000 * time.Millisecond)
	defer ticker_pulse.Stop()

	for {
		select {
		case <-ticker_pulse.C:
			// announce to all peers the time
			for _, p := range n.peersInfo {
				slot := uint32(time.Now().Unix())
				if n.id != p.PeerID {
					p.SendBlockAnnouncement(slot)
				}
			}
		}
	}
}

func (n *Node) onBlockAnnouncement(stream quic.Stream, msg []byte, peerID uint16) (err error) {
	defer stream.Close()
	var newReq BlockAnnouncement
	// Deserialize byte array back into the struct
	err = newReq.FromBytes(msg)
	if err != nil {
		fmt.Println("Error deserializing:", err)
		return
	}
	// <-- FIN
	fmt.Printf("onBlockAnnouncement %d received by %d from peer %d\n", newReq.Timeslot, n.id, peerID)
	return nil
}

func (n *Node) DispatchIncomingQUICStream(stream quic.Stream, peerID uint16) error {
	var msgType byte

	msgTypeBytes := make([]byte, 1) // code
	msgLenBytes := make([]byte, 4)
	_, err := stream.Read(msgTypeBytes)
	if err != nil {
		fmt.Printf("DispatchIncomingQUICStream1 ERR %v\n", err)
		return err
	}
	msgType = msgTypeBytes[0]
	// fmt.Printf("%s DispatchIncomingQUICStream from %d bytesRead=%d CODE=%d\n", n.String(), peerID, nRead, msgType)

	_, err = stream.Read(msgLenBytes)
	if err != nil {
		fmt.Printf("DispatchIncomingQUICStream2 ERR %v\n", err)
		return err
	}
	msgLen := binary.BigEndian.Uint32(msgLenBytes)
	msg := make([]byte, msgLen)
	_, err = stream.Read(msg)
	//fmt.Printf("DispatchIncomingQUICStream3 nRead=%d msgLen=%d\n", nRead, msgLen)
	// Dispatch based on msgType
	switch msgType {
	case UP0_BlockAnnouncement:
		n.onBlockAnnouncement(stream, msg, peerID)
	}

	return nil
}
