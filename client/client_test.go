package main_test

import (
	"encoding/hex"
	
	"context"
	"crypto/ed25519"
	//	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	//"crypto/x509/pkix"
	"encoding/base32"
	//"encoding/pem"
	"fmt"
	"log"
	//"math/big"
	"strings"
	"testing"
	//"time"

	"github.com/quic-go/quic-go"
)

func decodeSAN(san string) ([]byte, error) {
	if !strings.HasPrefix(san, "e") {
		return nil, fmt.Errorf("SAN does not start with 'e'")
	}
	encoded := strings.ToUpper(san[1:]) // base32 expects uppercase
	b32 := base32.StdEncoding.WithPadding(base32.NoPadding)
	pubkey, err := b32.DecodeString(encoded)
	if err != nil {
		return nil, fmt.Errorf("base32 decode failed: %w", err)
	}
	if len(pubkey) != 32 {
		return nil, fmt.Errorf("decoded key length = %d, expected 32", len(pubkey))
	}
	return pubkey, nil
}

func encodeSAN(pub ed25519.PublicKey) string {
	b32 := base32.StdEncoding.WithPadding(base32.NoPadding)
	return "e" + strings.ToLower(b32.EncodeToString(pub))
}

func TestDecodeEncodeSAN(t *testing.T) {
	testCases := []struct {
		san         string
		expectedHex string
	}{
		{
			san:         "egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa",
			expectedHex: "e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
		},
		{
			san:         "e42haz57snrm7sy5vqrrafursptelydco76gltk6uaexzu4o6z4aa",
			expectedHex: "e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
		},
	}

	for _, tc := range testCases {
		pubkeyBytes, err := decodeSAN(tc.san)
		if err != nil {
			t.Errorf("decodeSAN(%s) failed: %v", tc.san, err)
			continue
		}

		pubkeyHex := hex.EncodeToString(pubkeyBytes)
		if pubkeyHex != tc.expectedHex {
			t.Errorf("decoded hex mismatch for %s: got %s, want %s", tc.san, pubkeyHex, tc.expectedHex)
		} else {
			t.Logf("✅ %s → %s", tc.san, pubkeyHex)
		}

		// Round-trip check
		roundTripSAN := encodeSAN(pubkeyBytes)
		if roundTripSAN != tc.san {
			t.Logf("⚠️  round-trip SAN mismatch: input=%s roundtrip=%s", tc.san, roundTripSAN)
		}
	}
}



func TestPolkajam(t *testing.T) {
	x := "0259fbe9"  // QUESTION: how should we actually compute this?
	alpn := "jamnp-s/0/" + x
	alpn_builder := alpn + "/builder"

	// Client connect with peer verification
	clientTLS := &tls.Config{
		InsecureSkipVerify: true,
		NextProtos:         []string{alpn, alpn_builder},
		VerifyPeerCertificate: func(rawCerts [][]byte, _ [][]*x509.Certificate) error {
			cert, err := x509.ParseCertificate(rawCerts[0])
			if err != nil {
				return fmt.Errorf("parse cert: %w", err)
			}
			pubKey, ok := cert.PublicKey.(ed25519.PublicKey)
			if !ok {
				return fmt.Errorf("not ed25519")
			}
			actualSAN := ""
			if len(cert.DNSNames) > 0 {
				actualSAN = cert.DNSNames[0]
			}
			expected := encodeSAN(pubKey)
			if actualSAN != expected {
				expectedPubHex := fmt.Sprintf("%x", pubKey)
				actualPubHex := fmt.Sprintf("%x", cert.PublicKey.(ed25519.PublicKey))
				for i := 0; i < len(cert.DNSNames); i++ {
					fmt.Printf("SAN check failed: received cert.DNSNames[%d] = %s\n", i, cert.DNSNames[i])
				}

				return fmt.Errorf("SAN mismatch: expected %s, got %s\nExpected PubKey (hex): %s\nActual PubKey (hex):   %s",
					expected, actualSAN, expectedPubHex, actualPubHex)
			}
			log.Printf("✔ Verified SAN: %s", actualSAN)
			return nil
		},
	}

	// ./polkajam --temp --chain dev --parameters tiny run  --dev-validator 2 --rpc-port=19802
	addr2 := "localhost:40002" 
	session, err := quic.DialAddr(context.Background(), addr2, clientTLS, nil)
	if err != nil {
		t.Fatalf("client connect failed: %v", err)
	}
	defer session.CloseWithError(0, "done")
}



