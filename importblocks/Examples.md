# Importblocks Example

Testing implementation against importblocks:
~~~bash
# Example usage
./importblocks_runner.sh \
    http="http://your_implementation.com:port" \
    mode="safrole" \
    numblocks="100" \
    invalidrate="0.20" \
    statistics="10"
~~~


**Example 1**: validation only, **fallback** mode
```
// Set invalidrate=0 to disable any fuzzing

./importblocks_runner.sh \
    http="http://implementation.jamduna.org:8088" \
    mode="fallback" \
    numblocks="100" \
    invalidrate="0" \
    statistics="100"
```
**Output 1:**
```
importblocks - JAM Duna Import Blocks generator
{
  "Mode": "fallback",
  "HTTP": "http://implementation.jamduna.org:8088",
  "QUIC": "",
  "Verbose": false,
  "NumBlocks": 100,
  "InvalidRate": 0,
  "Statistics": 100,
  "Endpoint": "",
  "Network": "tiny"
}
2025/02/07 20:46:09 [INFO] Starting block generation: mode=fallback, numBlocks=100, dir=/tmp/importBlock
Selected Dir: fallback
Loaded 49 state transitions
Fuzz ready! sources=49
InvalidRate=0.00 -> invalidBlocks=0 | validBlocks=100 | total=100
[#12 e=1,m=000] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#31 e=2,m=007] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#20 e=1,m=008] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#55 e=4,m=007] NotFuzzable  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#21 e=1,m=009] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#34 e=2,m=010] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
....
[#13 e=1,m=001] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#48 e=4,m=000] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#56 e=4,m=008] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#41 e=3,m=005] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#60 e=5,m=000] NotFuzzable  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#35 e=2,m=011] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#23 e=1,m=011] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#51 e=4,m=003] NotFuzzable  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#33 e=2,m=009] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
2025/02/07 20:46:10 Fuzz completed: 0 invalid blocks, 100 valid blocks
2025/02/07 20:46:18 [fallback Mode] Done in 9.84s
{
  "basic": {
    "FuzzedBlocks": 0,
    "FuzzedRate": 0,
    "OriginalBlocks": 100,
    "TotalBlocks": 100
  },
  "fuzz": {
    "FalseNegativeRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TruePositiveRate": 0
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1,
    "TrueNegativeRate": 0
  },
  "overall": {
    "CorrectRate": 0,
    "FlaggedRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1
  }
}
```

**Example 2**: validation only, **safrole** mode 

```
// Set invalidrate=0 to disable any fuzzing

./importblocks_runner.sh \
    http="http://implementation.jamduna.org:8088" \
    mode="safrole" \
    numblocks="100" \
    invalidrate="0" \
    statistics="50"
```

**Output 2:**
```
importblocks - JAM Duna Import Blocks generator
{
  "Mode": "safrole",
  "HTTP": "http://implementation.jamduna.org:8088",
  "QUIC": "",
  "Verbose": false,
  "NumBlocks": 100,
  "InvalidRate": 0,
  "Statistics": 50,
  "Endpoint": "",
  "Network": "tiny"
}
2025/02/07 20:16:37 [INFO] Starting block generation: mode=safrole, numBlocks=100, dir=/tmp/importBlock
Selected Dir: safrole
Loaded 49 state transitions
Fuzz ready! sources=49
InvalidRate=0.00 -> invalidBlocks=0 | validBlocks=100 | total=100
[#26 e=2,m=002] Fuzzable!!!  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#26 e=2,m=002] Fuzzed with EpochLotteryOver ouf of 6 possible errors = [BadTicketAttemptNumber TicketAlreadyInState TicketsBadOrder BadRingProof EpochLotteryOver TimeslotNotMonotonic]
[#31 e=2,m=007] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#22 e=1,m=010] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#18 e=1,m=006] Fuzzable!!!  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#18 e=1,m=006] Fuzzed with EpochLotteryOver ouf of 6 possible errors = [BadTicketAttemptNumber TicketAlreadyInState TicketsBadOrder BadRingProof EpochLotteryOver TimeslotNotMonotonic]
[#25 e=2,m=001] Fuzzable!!!  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#25 e=2,m=001] Fuzzed with TicketAlreadyInState ouf of 6 possible errors = [BadTicketAttemptNumber TicketAlreadyInState TicketsBadOrder BadRingProof EpochLotteryOver TimeslotNotMonotonic]

...

[#48 e=4,m=000] Fuzzed with TicketsBadOrder ouf of 4 possible errors = [BadTicketAttemptNumber TicketsBadOrder BadRingProof EpochLotteryOver]
[#43 e=3,m=007] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#12 e=1,m=000] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
2025/02/07 20:17:10 Fuzz completed: 0 invalid blocks, 100 valid blocks
2025/02/07 20:17:13 [safrole Mode]

...

2025/02/07 20:17:21 [safrole Mode]

....

2025/02/07 20:17:36 [safrole Mode] Done in 59.33s
{
  "basic": {
    "FuzzedBlocks": 0,
    "FuzzedRate": 0,
    "OriginalBlocks": 100,
    "TotalBlocks": 100
  },
  "fuzz": {
    "FalseNegativeRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TruePositiveRate": 0
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TrueNegativeRate": 1
  },
  "overall": {
    "CorrectRate": 1,
    "FlaggedRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0
  }
}
```

**Example 3**: **invalidrate**=0.31459, **assurances** node 
```
// Set invalidrate=0.31459
./importblocks_runner.sh \
    http="http://implementation.jamduna.org:8088" \
    mode="assurances" \
    numblocks="100" \
    invalidrate="0.31459" \
    statistics="50"
```

**Output 3:**
```
importblocks - JAM Duna Import Blocks generator
{
  "Mode": "assurances",
  "HTTP": "http://implementation.jamduna.org:8088",
  "QUIC": "",
  "Verbose": false,
  "NumBlocks": 100,
  "InvalidRate": 0.31459,
  "Statistics": 50,
  "Endpoint": "",
  "Network": "tiny"
}
2025/02/07 20:28:38 [INFO] Starting block generation: mode=assurances, numBlocks=100, dir=/tmp/importBlock
Selected Dir: assurances
Loaded 28 state transitions
Fuzz ready! sources=28
InvalidRate=0.31 -> invalidBlocks=31 | validBlocks=69 | total=100
[#15 e=1,m=003] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#16 e=1,m=004] Fuzzable!!!  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#16 e=1,m=004] Fuzzed with BadCore ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#18 e=1,m=006] NotFuzzable  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#26 e=2,m=002] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#36 e=3,m=000] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#33 e=2,m=009] Fuzzable!!!  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#33 e=2,m=009] Fuzzed with BadParentHash ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#34 e=2,m=010] NotFuzzable  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#29 e=2,m=005] Fuzzable!!!  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#29 e=2,m=005] Fuzzed with BadParentHash ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
....
[#25 e=2,m=001] Fuzzed with BadCore ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#37 e=3,m=001] Fuzzable!!!  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#37 e=3,m=001] Fuzzed with BadSignature ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
2025/02/07 20:29:16 Fuzz completed: 31 invalid blocks, 69 valid blocks

2025/02/07 20:29:17 B#004 Fuzzed: BadSignature
2025/02/07 20:29:17 B#006 Fuzzed: BadSignature
2025/02/07 20:29:17 B#009 Fuzzed: BadCore
2025/02/07 20:29:18 B#012 Fuzzed: BadParentHash
2025/02/07 20:29:18 B#013 Fuzzed: BadCore
2025/02/07 20:29:18 B#017 Fuzzed: BadValidatorIndex
2025/02/07 20:29:19 B#021 Fuzzed: BadParentHash
2025/02/07 20:29:19 B#022 Fuzzed: BadSignature
2025/02/07 20:29:19 B#024 Fuzzed: BadValidatorIndex
2025/02/07 20:29:19 B#026 Fuzzed: BadSignature
2025/02/07 20:29:19 B#030 Fuzzed: BadSignature
2025/02/07 20:29:19 B#032 Fuzzed: BadCore
2025/02/07 20:29:20 B#034 Fuzzed: BadParentHash
2025/02/07 20:29:20 B#035 Fuzzed: BadCore
2025/02/07 20:29:20 B#043 Fuzzed: BadValidatorIndex
2025/02/07 20:29:21 [assurances Mode]
Stats:
{
  "basic": {
    "FuzzedBlocks": 15,
    "FuzzedRate": 0.3,
    "OriginalBlocks": 35,
    "TotalBlocks": 50
  },
  "fuzz": {
    "FalseNegativeRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1,
    "TruePositiveRate": 0
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1,
    "TrueNegativeRate": 0
  },
  "overall": {
    "CorrectRate": 0,
    "FlaggedRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1
  }
}
2025/02/07 20:29:21 B#053 Fuzzed: BadParentHash
2025/02/07 20:29:22 B#056 Fuzzed: BadParentHash
2025/02/07 20:29:22 B#057 Fuzzed: BadValidatorIndex
2025/02/07 20:29:22 B#062 Fuzzed: BadParentHash
2025/02/07 20:29:22 B#064 Fuzzed: BadParentHash
2025/02/07 20:29:22 B#066 Fuzzed: BadParentHash
2025/02/07 20:29:23 B#067 Fuzzed: BadCore
2025/02/07 20:29:23 B#068 Fuzzed: BadValidatorIndex
2025/02/07 20:29:23 B#075 Fuzzed: BadValidatorIndex
2025/02/07 20:29:24 B#083 Fuzzed: BadValidatorIndex
2025/02/07 20:29:24 B#084 Fuzzed: BadParentHash
2025/02/07 20:29:24 B#086 Fuzzed: BadParentHash
2025/02/07 20:29:24 B#087 Fuzzed: BadSignature
2025/02/07 20:29:25 B#089 Fuzzed: BadSignature
2025/02/07 20:29:25 B#091 Fuzzed: BadCore
2025/02/07 20:29:25 B#097 Fuzzed: BadParentHash
2025/02/07 20:29:25 [assurances Mode]
Stats:
...
2025/02/07 20:29:25 [assurances Mode] Done in 47.04s
{
  "basic": {
    "FuzzedBlocks": 31,
    "FuzzedRate": 0.31,
    "OriginalBlocks": 69,
    "TotalBlocks": 100
  },
  "fuzz": {
    "FalseNegativeRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1,
    "TruePositiveRate": 0
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1,
    "TrueNegativeRate": 0
  },
  "overall": {
    "CorrectRate": 0,
    "FlaggedRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 1
  }
}
```