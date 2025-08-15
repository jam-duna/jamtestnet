# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared [jamtestvectors](https://github.com/w3f/jamtestvectors) and a basic [jam-conformance](https://github.com/davxy/jam-conformance) fuzzing process.

This repo contains the latest `duna_fuzzer` and `duna_target` (Linux + Mac) targeting 0.6.7 and some useful test banks.  

After we get to 0.7.x conformance, we will get back to getting a multiclient **tiny** testnet going.

## Fuzzer: Quick start

1. Run a *Fuzzer target*: (see [jam-conformance repo](https://github.com/davxy/jam-conformance/issues) for active teams)

Example 1: [JAM DUNA](https://github.com/jamduna/jamtestnet)
```
% ./duna_target_mac --pvm-logging trace
2025/08/14 14:17:47 Starting target on socket: /tmp/jam_target.sock
2025/08/14 14:17:47 Target listening on /tmp/jam_target.sock
```

Example 2: [JavaJam](https://github.com/javajamio/javajam-releases)
```
% bin/javajam fuzz /tmp/jam_target.sock
❤ JavaJAM

22:00:11.265 INFO  FuzzServer -- Fuzzer server listening on /tmp/jam_target.sock 
22:00:11.266 INFO  FuzzServer -- ChainSpec: TINY 
```

Example 3: [JamZig](https://github.com/jamzig/conformance-releases)
```
% ./conformance-releases/tiny/macos/aarch64/jam_conformance_target
JAM Conformance Target Server
=============================
Socket path: /tmp/jam_conformance.sock

Starting server...
Listening on Unix socket: /tmp/jam_conformance.sock
Press Ctrl+C to stop
```

2. Run the *fuzzer* with the above target socket endpoint and a test bank:

Example 1: `algo` (found [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/algo))
```
./duna_fuzzer_mac --test-dir ~/Desktop/jamtestnet/0.6.7/algo  --socket=/tmp/jam_target.sock
```

Example 2: `game_of_life` (found [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/game_of_life))
```
./duna_fuzzer_mac --test-dir ~/Desktop/jamtestnet/0.6.7/game_of_life --socket=/tmp/jam_target.sock
```

Example 3: `jam-conformance` (found [here](https://github.com/jam-duna/jamtestnet/tree/main/0.6.7/jam-conformance))
```
./duna_fuzzer_mac --test-dir ~/Desktop/jamtestnet/0.6.7/jam-conformance  --socket=/tmp/jam_target.sock
```
(This is a rapidly changing dataset -- we'll try to update it every time we publish a new fuzzer/target version)

The above 3 test banks are in this repo, but others should work too.

#### Result

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

## How to get PVM Traces for any state transition using the jamduna fuzzer + fuzzer target

Teams can get PVM traces from the `duna_target`  
(a) run `duna_fuzzer` and supplying a directory with `.bin` test files  as the `--test-dir` parameter
(b) run `duna_target` with `--pvm-logging debug` flag or `--pvm-logging trace` flag

With `--pvm-logging debug` logs you get one line per pvm step (with pc, gas, registers):
```
% ./duna_target_mac --pvm-logging debug
2025/08/14 13:34:50 Starting target on socket: /tmp/jam_target.sock
2025/08/14 13:34:50 Target listening on /tmp/jam_target.sock

...
2025/08/14 13:34:54 [INCOMING REQUEST] ImportBlock
2025/08/14 13:34:54 Received ImportBlock request for block hash: 0x193f7dc1328e396932a38eb0cffb19e953ef5f23f1b924cdca426c3eef35484d
accumulate: JUMP               step:     0 pc:  5386 gas:4999999 Registers:[4294901760 4278059008 0 0 0 0 0 4278124544 3 0 0 0 0]
accumulate: MOVE_REG           step:     1 pc:  5388 gas:4999996 Registers:[4294901760 4278059008 0 0 0 0 0 4278124544 3 0 4278124544 0 0]
accumulate: LOAD_IMM           step:     2 pc:  5393 gas:4999996 Registers:[4294901760 4278059008 0 0 0 0 0 65536 3 0 4278124544 0 0]
... 
```

With `--pvm-logging trace` you get 2 lines, one like the above and another roughly matching that of `polkajam`.
```
% ./duna_target_mac --pvm-logging trace
2025/08/14 16:01:41 Starting target on socket: /tmp/jam_conformance.sock
2025/08/14 16:01:41 Target listening on /tmp/jam_conformance.sock
2025/08/14 16:01:49 Fuzzer connected.
2025/08/14 16:01:49 [INCOMING REQUEST] PeerInfo
2025/08/14 16:01:49 Received handshake from fuzzer: jam-duna-fuzzer-0.6.7.14
2025/08/14 16:01:49 [OUTGOING RESPONSE] PeerInfo
2025/08/14 16:01:49 [INCOMING REQUEST] SetState
2025/08/14 16:01:49 Received SetState request with 34 key-value pairs.
2025/08/14 16:01:49 Setting state with header: 0x3e90aa8a6ba08f64dfa589b628b63dc6ff8114582e01cfe28bc8152ee7398ada
2025/08/14 16:01:49 StateDB initialized with 34 key-value pairs. stateRoot: 0x451fab9ecf3f1eb1378211ed840cf089914c75b99fec126e67f79e00734442b7 | HeaderHash: 0x3e90aa8a6ba08f64dfa589b628b63dc6ff8114582e01cfe28bc8152ee7398ada
2025/08/14 16:01:49 [OUTGOING RESPONSE] StateRoot
...
2025/08/14 16:01:49 [INCOMING REQUEST] ImportBlock
2025/08/14 16:01:49 Received ImportBlock request for block hash: 0x193f7dc1328e396932a38eb0cffb19e953ef5f23f1b924cdca426c3eef35484d
*** jump 5386
accumulate: JUMP               step:     0 pc:  5386 gas:4999999 Registers:[4294901760 4278059008 0 0 0 0 0 4278124544 3 0 0 0 0]
TRACE polkavm::interpreter a3 = 0xfeff0000
accumulate: MOVE_REG           step:     1 pc:  5388 gas:4999996 Registers:[4294901760 4278059008 0 0 0 0 0 4278124544 3 0 4278124544 0 0]
TRACE polkavm::interpreter a0 = 0x10000
accumulate: LOAD_IMM           step:     2 pc:  5393 gas:4999996 Registers:[4294901760 4278059008 0 0 0 0 0 65536 3 0 4278124544 0 0]
accumulate: BRANCH_EQ_IMM      step:     3 pc:  5397 gas:4999996 Registers:[4294901760 4278059008 0 0 0 0 0 65536 3 0 4278124544 0 0]
TRACE polkavm::interpreter sp = 0xfefdff68
accumulate: ADD_IMM_64         step:     4 pc:  5401 gas:4999988 Registers:[4294901760 4278058856 0 0 0 0 0 65536 3 0 4278124544 0 0]
TRACE polkavm::interpreter u64 [0xfefdfff8] = ra = 0xffff0000
accumulate: STORE_IND_U64      step:     5 pc:  5405 gas:4999988 Registers:[4294901760 4278058856 0 0 0 0 0 65536 3 0 4278124544 0 0]
TRACE polkavm::interpreter u64 [0xfefdfff0] = s0 = 0x0
accumulate: STORE_IND_U64      step:     6 pc:  5409 gas:4999988 Registers:[4294901760 4278058856 0 0 0 0 0 65536 3 0 4278124544 0 0]
TRACE polkavm::interpreter u64 [0xfefdffe8] = s1 = 0x0
...
```

If you find a discrepancy between implementations, please create an issue with a link to a test file and your trace formatted in identical form to the `debug` trace.

## 



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
* 0.6.7 [Fuzzer + Fuzzer Target](https://github.com/jam-duna/jamtestnet)  released, demonstrated approximate parity of recompiler performance on Game of Life, see [Game of Life Recompiler Comparison -- JAM DUNA vs Polkajam](https://docs.google.com/spreadsheets/d/1ZzAhksLEs7mI9jidRvjdnBzbDDqF-oVtrgXQ1_P6t_A/edit?usp=sharing):




# Got JAM?  Lets JAM!

Terrific - please let everyone know in [Lets JAM Matrix Room](https://matrix.to/#/#jam:polkadot.io)
