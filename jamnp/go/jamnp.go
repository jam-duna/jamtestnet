package main

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
	UP0_BlockAnnouncement      byte = 0
	CE128_BlockRequest         byte = 128
	CE129_StateRequest         byte = 129
	CE131_TicketDistribution   byte = 131
	CE132_TicketDistributionP  byte = 132
	CE133_WorkPackageSubmission byte = 133
	// ...
)

const (
	numNodes = 6
	quicAddr = "127.0.0.1:%d"
)

type Node struct {
	id            uint16
	credential    ValidatorSecret
	peersInfo     map[uint16]*Peer
	server        quic.Listener
	tlsConfig     *tls.Config
	clients       map[string]string
	clientsMutex  sync.RWMutex
	peersInfoMutex sync.RWMutex
}

type Peer struct {
	node      *Node
	PeerID    uint16      `json:"peer_id"`
	PeerAddr  string      `json:"peer_addr"`
	Validator Validator   `json:"validator"`
}


type Ed25519Priv ed25519.PrivateKey

type Validator struct {
	Ed25519 ed25519.PublicKey `json:"ed25519"`
}

type ValidatorSecret struct {
	Ed25519Pub    ed25519.PublicKey
	Ed25519Secret ed25519.PrivateKey
}

func generateSelfSignedCert(ed25519Pub ed25519.PublicKey, ed25519Priv ed25519.PrivateKey) (tls.Certificate, error) {
	template := x509.Certificate{
		SerialNumber: big.NewInt(1),
		//Subject: pkix.Name{
		//	Organization: []string{"jamduna.org"},
		//},
		NotBefore: time.Now(),
		NotAfter:  time.Now().Add(365 * 24 * time.Hour),
		KeyUsage:  x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage: []x509.ExtKeyUsage{
			x509.ExtKeyUsageServerAuth,
		},
		IPAddresses: []net.IP{net.ParseIP("127.0.0.1")},
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, ed25519Pub, ed25519Priv)
	if err != nil {
		return tls.Certificate{}, err
	}

	certPEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
	privKeyBytes, err := x509.MarshalPKCS8PrivateKey(ed25519Priv)
	if err != nil {
		return tls.Certificate{}, err
	}
	privKeyPEM := pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: privKeyBytes})

	return tls.X509KeyPair(certPEM, privKeyPEM)
}

func InitEd25519Key(seed []byte) (ed25519.PublicKey, []byte, error) {
        ed25519_priv := ed25519.NewKeyFromSeed(seed)
        ed25519_pub := ed25519_priv.Public().(ed25519.PublicKey)
        return ed25519_pub, ed25519_priv, nil
}

func GenerateQuicConfig() *quic.Config {
	return &quic.Config{
		Allow0RTT:       true,
		KeepAlivePeriod: time.Minute,
	}
}

func NewNode(id uint16, credential ValidatorSecret, startPeerList map[uint16]*Peer, port int) (*Node, error) {
	addr := fmt.Sprintf("0.0.0.0:%d", port)
	ed25519Priv := credential.Ed25519Secret
	ed25519Pub := ed25519Priv.Public().(ed25519.PublicKey)

	cert, err := generateSelfSignedCert(ed25519Pub, ed25519Priv)
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
	}
	node.tlsConfig = tlsConfig

	listener, err := quic.ListenAddr(addr, tlsConfig, GenerateQuicConfig())
	if err != nil {
		return nil, fmt.Errorf("Error starting QUIC listener: %v", err)
	}
	node.server = *listener

	for validatorIndex, peer := range startPeerList {
		node.peersInfo[validatorIndex] = peer
	}

	go node.runServer()
	return node, nil
}

func (n *Node) lookupPubKey(pubKey string) (uint16, bool) {
	n.peersInfoMutex.RLock()
	defer n.peersInfoMutex.RUnlock()
	hpubKey := fmt.Sprintf("0x%s", pubKey)
	for validatorIndex, peer := range n.peersInfo {
		if hex.EncodeToString(peer.Validator.Ed25519) == hpubKey {
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

func (n *Node) DispatchIncomingQUICStream(stream quic.Stream, peerID uint16) error {
	var msgType byte
	msgTypeBytes := make([]byte, 1)
	msgLenBytes := make([]byte, 4)

	_, err := stream.Read(msgTypeBytes)
	if err != nil {
		return fmt.Errorf("DispatchIncomingQUICStream Read msgType error: %v", err)
	}
	msgType = msgTypeBytes[0]

	_, err = stream.Read(msgLenBytes)
	if err != nil {
		return fmt.Errorf("DispatchIncomingQUICStream Read msgLen error: %v", err)
	}
	msgLen := binary.BigEndian.Uint32(msgLenBytes)

	msg := make([]byte, msgLen)
	_, err = stream.Read(msg)
	if err != nil {
		return fmt.Errorf("DispatchIncomingQUICStream Read msg error: %v", err)
	}

	switch msgType {
	case UP0_BlockAnnouncement:
		// n.onBlockAnnouncement(stream, msg, peerID)
	case CE128_BlockRequest:
		// n.onBlockRequest(stream, msg)
	// Implement other case handlers here
	default:
		return errors.New("unknown message type")
	}

	return nil
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
	validatorSecret.Ed25519Pub = ed25519_pub
	return validatorSecret, nil
}


