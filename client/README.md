

### Setup:

This runs a polkajam dev-validator 2 on port 40002 (Carol [here](https://docs.jamcha.in/basics/dev-accounts#carol))
```
./polkajam --temp --chain dev --parameters tiny run  --dev-validator 2 --rpc-port=19802
```

This go test connects to "Carol":
```
root@coretime:~/go/src/github.com/jam-duna/jamtestnet/client# go test -run TestPolkajam
SAN check failed: received cert.DNSNames[0] = egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa
--- FAIL: TestPolkajam (0.02s)
    client_test.go:126: client connect failed: CRYPTO_ERROR 0x12a (local): SAN mismatch: expected e42haz57snrm7sy5vqrrafursptelydco76gltk6uaexzu4o6z4aa, got egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa
        Expected PubKey (hex): e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00
        Actual PubKey (hex):   e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00
FAIL
exit status 1
FAIL	github.com/jam-duna/jamtestnet/client	0.026s
```

However, we are seeing a SAN mismatch where we expect `e42haz57snrm7sy5vqrrafursptelydco76gltk6uaexzu4o6z4aa` but actually get `egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa`



The decoding of the SAN `egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa` results in `35c7986d7e62ed2fc6b62530402566e0e5959b09f9c73dd65a0e174ce33b7980` and does not match up with validator 2's SAN [Carol](https://docs.jamcha.in/basics/dev-accounts#carol). 

```
root@coretime:~/go/src/github.com/jam-duna/jamtestnet/client# go test -run TestDecodeEncodeSAN
--- FAIL: TestDecodeEncodeSAN (0.00s)
    client_test.go:69: decoded hex mismatch for egxdzq3l6mlws7rvweuyeajlg4dszlgyj7hdt3vs2byluzyz3pgaa: got 35c7986d7e62ed2fc6b62530402566e0e5959b09f9c73dd65a0e174ce33b7980, want e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00
    client_test.go:71: ✅ e42haz57snrm7sy5vqrrafursptelydco76gltk6uaexzu4o6z4aa → e68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00
FAIL
exit status 1
```

Not entirely sure why the SANs revealed presented do not match up 

A simple workaround is simply to not check SANs but check pubkey