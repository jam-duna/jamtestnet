# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams [here](https://github.com/w3f/jamtestvectors).

This repo contains the latest `jamduna` fuzzer (Linux + Mac) targeting 0.6.7 and some useful test banks.  

After we get to 0.7.x conformance, we will get back to a multiclient **tiny** testnet going, with a high performance recompiler that can do 1B gas/sec.

## Fuzzer: Quick start

1. Run your Fuzzer target: (e.g. with https://github.com/jamzig/conformance-releases)

Example: JamZig
```
% ./conformance-releases/tiny/macos/aarch64/jam_conformance_target
JAM Conformance Target Server
=============================
Socket path: /tmp/jam_conformance.sock

Starting server...
Listening on Unix socket: /tmp/jam_conformance.sock
Press Ctrl+C to stop
```

Example: JavaJam
```
% bin/javajam fuzz /tmp/jam_conformance.sock
❤ JavaJAM

22:00:11.265 INFO  FuzzServer -- Fuzzer server listening on /tmp/jam_conformance.sock 
22:00:11.266 INFO  FuzzServer -- ChainSpec: TINY 
```

2. Run the *jamduna fuzzer* with the above target socket endpoint and a test bank

Example 1: `algo` (found [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/algo))
```
./duna_fuzzer_mac --test-dir ~/Desktop/jamtestnet/0.6.7/algo  --socket=/tmp/jam_conformance.sock
```

Example 2: `jam-conformance` (found [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/jam-conformance))
```
./duna_fuzzer_mac --test-dir ~/Desktop/jamtestnet/0.6.7/jam-conformance  --socket=/tmp/jam_conformance.sock
```

The above 2 test banks are in this repo, but others should work too.

## Result

If everything is working you should see this from the fuzzer:

<img width="1098" height="725" alt="Image" src="https://github.com/user-attachments/assets/e6010a8e-546f-486e-9e32-a37b375ed0a0" />

If the fuzzer runs into a failure you get an execution report:
```
[big giant JSON object with the prestate, block, poststate]
Diff on 1 keys: [0x1000000000000000000000000000000000000000000000000000000000000000]
========================================
State Key: c16 (0x1000000000000000000000000000000000000000000000000000000000000000)
c16        | PreState : 0x0114000000ce07e7687972cccfbfe304e4217db58cde9b833750fe557d4e543771b2214db7
c16        | Expected: 0x00000000000000000000000000000000000000000000000000000000000000000000000000
c16        | Actual:   0x0114000000ce07e7687972cccfbfe304e4217db58cde9b833750fe557d4e543771b2214db7
------ c16 JSON DONE ------
```

If you find a discrepancy between the fuzzer and your target, please file an issue!

# History

Nov 2024 - Dec 2025:
* initial setup of fallback/safrole datasets, now covered in [this dataset](https://github.com/davxy/jam-test-vectors/pull/45)

Feb - early March 2025:
* [0.6.2.12 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.2.12)

Late March 2025 - Early April 2025:
* [0.6.4.4 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4)

May 2025:
* [0.6.5.2 jamduna binary](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.5.2) 

June 2025:
* First contact with Multiclient JAM Testnet with polkajam + javajam

July 2025:
* 0.6.5 Recompiler success with Doom + Algo 

August 2025:
* 0.6.7 [Fuzzer Target](https://github.com/jam-duna/jamduna-target-releases) released 
* 0.6.7 [Fuzzer](https://github.com/jam-duna/jamtestnet) released 


# Got JAM?  Lets JAM!

Terrific - please let everyone know in [Lets JAM Matrix Room](https://matrix.to/#/#jam:polkadot.io)
