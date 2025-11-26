# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared [jamtestvectors](https://github.com/w3f/jamtestvectors) and a basic [jam-conformance](https://github.com/davxy/jam-conformance) fuzzing process.

This repo contains the latest `duna_fuzzer` and `duna_target` (Linux + Mac) targeting 0.6.7 and some useful test banks.  

After we get to 0.7.x conformance, we will get back to getting a multiclient **tiny** testnet going.

## Fuzzer: Quick start

1. Run a *Fuzzer target*: (see [jam-conformance repo](https://github.com/davxy/jam-conformance/issues) for active teams)

Example:
```
% ./duna_target_mac --pvm-logging trace
2025/08/14 14:17:47 Starting target on socket: /tmp/jam_target.sock
2025/08/14 14:17:47 Target listening on /tmp/jam_target.sock
```

2. Run the *fuzzer* with the above target socket endpoint and a test bank in the `./rawdata` directory and the fuzzer will send to the fuzz target:

Example: 
```
./duna_fuzzer_mac  --socket=/tmp/jam_target.sock
```

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

## Game of Life Recompiler Performance

JAM DUNA is happy to report initial recompiler performance results on [game of life](https://github.com/colorfulnotion/polkavm/tree/dev/services/game_of_life) match up closely with that of polkajam in 0.6.7 tiny testnets:

| WP | # steps | RefineGasUsed | Compile  (ms) | Execution (ms) | Total   | Polkajam node 1 | Polkajam node 2 | Average 1+2 | Comparison | ChildGasUsed   | ms/step | gas/step  |
|:---|:--------|:--------------|:--------------|:---------------|:--------|:----------------|:----------------|:------------|:-----------|:---------------|:--------|:----------|
| 1  |         | 73581         | 4.6           | 5.1            | 9.6     | 8.4             | 8.1             | 8.2         | 85.25%     |                |         |           |
| 2  | 760     | 73641         | 4.1           | 213.7          | 217.8   | 219.0           | 218.8           | 218.9       | 100.47%    | 1,788,605,516  | 0.3     | 2,353,428 |
| 3  | 1510    | 104880        | 4.7           | 419.6          | 424.3   | 392.4           | 396.5           | 394.4       | 92.96%     | 3,553,649,782  | 0.3     | 2,353,410 |
| 4  | 2260    | 104880        | 7.1           | 1167.5         | 1174.5  | 1033.3          | 1044.9          | 1039.1      | 88.47%     | 5,318,666,032  | 0.5     | 2,353,392 |
| 5  | 3010    | 104880        | 4.2           | 831.7          | 835.9   | 794.2           | 796.4           | 795.3       | 95.15%     | 7,083,682,282  | 0.3     | 2,353,383 |
| 6  | 3760    | 104880        | 4.3           | 1038.5         | 1042.8  | 962.4           | 973.0           | 967.7       | 92.79%     | 8,848,698,532  | 0.3     | 2,353,377 |
| 7  | 4510    | 104910        | 4.2           | 1261.4         | 1265.5  | 1189.2          | 1195.0          | 1192.1      | 94.19%     | 10,613,714,782 | 0.3     | 2,353,374 |
| 8  | 5260    | 104910        | 4.3           | 1446.8         | 1451.0  | 1344.8          | 1354.6          | 1349.7      | 93.02%     | 12,378,731,032 | 0.3     | 2,353,371 |
| 9  | 6010    | 104910        | 4.2           | 1655.2         | 1659.3  | 1555.4          | 1568.6          | 1562.0      | 94.13%     | 14,143,747,282 | 0.3     | 2,353,369 |
| 10 | 6760    | 104910        | 6.5           | 2447.9         | 2454.5  | 2295.3          | 2302.9          | 2299.1      | 93.67%     | 15,908,763,532 | 0.4     | 2,353,367 |
| 11 | 7510    | 104905        | 4.6           | 2066.9         | 2071.5  | 1919.3          | 1934.3          | 1926.8      | 93.02%     | 17,673,779,782 | 0.3     | 2,353,366 |
|    |         |               |               |                | 12606.9 |                  |                  | 11753.3     | 93.23%     |                |         |           |

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
* 0.6.7.x [Fuzzer + Fuzzer Target](https://github.com/jam-duna/jamtestnet)  released
* Demonstrated approximate parity of recompiler performance on Game of Life, see [Game of Life Recompiler Comparison -- JAM DUNA vs Polkajam](https://docs.google.com/spreadsheets/d/1ZzAhksLEs7mI9jidRvjdnBzbDDqF-oVtrgXQ1_P6t_A/edit?usp=sharing) (data above, raw data from  [jamduna](./0.6.7/game_of_life/jamduna_record.txt) and [polkajam](./0.6.7/game_of_life/polkajam_record.txt)) 

September 2025:
* 0.7.0.x [Fuzzer + Fuzzer Target](https://github.com/jam-duna/jamtestnet) -- now optimizing for [JAM Conformance](https://paritytech.github.io/jam-conformance-dashboard/), implemented fuzzing with refine 

October/November 2025:
* 0.7.1 [jam-test-vectors + jam-conformance PVM traces vectors](https://github.com/jam-duna/jamtestnet) -- trace vectors passed with recompiler

# Got JAM?  Lets JAM!  Lets Conform!  

Terrific - please let everyone know in [JAM Conformance Matrix Room](https://matrix.to/#/#jam-conformance:polkadot.io)
