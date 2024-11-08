package jamnp

import (
	"context"
	"encoding/binary"
	"fmt"
	"github.com/quic-go/quic-go"
	"io"
)

type Peer struct {
	node *Node
	conn quic.Connection

	PeerID    uint16    `json:"peer_id"`
	PeerAddr  string    `json:"peer_addr"`
	Validator Validator `json:"validator"`
}

func NewPeer(n *Node, validatorIndex uint16, validator Validator, peerAddr string) (p *Peer) {
	p = &Peer{
		node:      n,
		PeerAddr:  peerAddr,
		Validator: validator,
		PeerID:    validatorIndex,
	}
	return p
}

func sendQuicBytes(stream quic.Stream, msg []byte) (err error) {
	// Create a buffer to hold the length of the message (big-endian uint32)
	msgLen := uint32(len(msg))
	lenBuf := make([]byte, 4)
	binary.BigEndian.PutUint32(lenBuf, msgLen)

	// First, write the message length to the stream
	_, err = stream.Write(lenBuf)
	if err != nil {
		return err
	}

	// Then, write the actual message to the stream
	_, err = stream.Write(msg)
	if err != nil {
		return err
	}

	return nil
}

func receiveQuicBytes(stream quic.Stream) (resp []byte, err error) {

	var lengthPrefix [4]byte
	_, err = io.ReadFull(stream, lengthPrefix[:])
	if err != nil {
		return
	}
	messageLength := binary.BigEndian.Uint32(lengthPrefix[:])
	buf := make([]byte, messageLength)
	_, err = io.ReadFull(stream, buf)
	if err != nil {
		return
	}
	return buf, nil
}

func (p *Peer) SendBlockAnnouncement(slot uint32) (err error) {
	req := BlockAnnouncement{
		Timeslot: slot,
	}
	reqBytes, err := req.ToBytes()
	if err != nil {
		return err
	}
	stream, err := p.openStream(UP0_BlockAnnouncement)
	if err != nil {
		fmt.Printf("SendBlockAnnouncment ERR %v\n", err)
		return err
	}
	err = sendQuicBytes(stream, reqBytes)
	if err != nil {
		fmt.Printf("SendBlockAnnouncement sendQuicBytes ERR %v\n", err)
		return err
	}
	//fmt.Printf("%s SendBlockAnnouncement (%v)\n", p.String(), req.HeaderHash)
	return nil
}

func (p *Peer) openStream(code uint8) (stream quic.Stream, err error) {

	if p.conn == nil {
		p.conn, err = quic.DialAddr(context.Background(), p.PeerAddr, p.node.tlsConfig, GenerateQuicConfig())
		if err != nil {
			fmt.Printf("-- openStream ERR %v peerAddr=%s\n", err, p.PeerAddr)
			return nil, err
		}
	}
	stream, err = p.conn.OpenStreamSync(context.Background())
	if err != nil {
		p.conn = nil
		return nil, err
	}

	_, err = stream.Write([]byte{code})
	if err != nil {
		fmt.Printf("Write -- ERR %v\n", err)
		return
	}

	if err == io.EOF {
		fmt.Println("EOF encountered during write.")
		return
	}
	return stream, nil
}
