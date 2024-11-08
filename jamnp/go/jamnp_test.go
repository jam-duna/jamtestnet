package jamnp

import (
	"fmt"
	"math/big"
	"testing"
)

func generateSeedSet(ringSize int) ([][]byte, error) {

	ringSet := make([][]byte, ringSize)
	for i := 0; i < ringSize; i++ {
		seed := make([]byte, 32)
		idxBytes := big.NewInt(int64(i)).Bytes()
		copy(seed[32-len(idxBytes):], idxBytes)
		ringSet[i] = seed
	}
	return ringSet, nil
}

func SetupQuicNetwork() (peers []string, peerList map[uint16]*Peer, validatorSecrets []ValidatorSecret, err error) {
	seeds, _ := generateSeedSet(numNodes)
	peers = make([]string, numNodes)
	peerList = make(map[uint16]*Peer)
	validators := make([]Validator, numNodes)

	for i := 0; i < numNodes; i++ {
		var validator Validator
		validator, err = InitValidator(seeds[i])
		if err == nil {
			validators[i] = validator
		} else {
			return
		}
	}

	for i := uint16(0); i < numNodes; i++ {
		addr := fmt.Sprintf(quicAddr, 9000+i)
		peers[i] = addr
		peerList[i] = &Peer{
			PeerID:    i,
			PeerAddr:  addr,
			Validator: validators[i],
		}
	}

	validatorSecrets = make([]ValidatorSecret, numNodes)
	for i := 0; i < numNodes; i++ {
		validatorSecret, err0 := InitValidatorSecret(seeds[i])
		if err0 != nil {
			return
		}
		validatorSecrets[i] = validatorSecret
	}
	return peers, peerList, validatorSecrets, nil
}

func TestNodeSafrole(t *testing.T) {
	_, peerList, validatorSecrets, err := SetupQuicNetwork()
	if err != nil {
		t.Fatalf("Error Setting up nodes: %v\n", err)
	}

	nodes := make([]*Node, numNodes)
	for i := 0; i < numNodes; i++ {
		node, err := NewNode(uint16(i), validatorSecrets[i], peerList, 9000+i)
		if err != nil {
			t.Fatalf("Failed to create node %d: %v\n", i, err)
		}
		nodes[i] = node
	}

	for {
	}
}
