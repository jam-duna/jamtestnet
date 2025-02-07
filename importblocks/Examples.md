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
importblocks_container
importblocks_container
Pulling Docker Image: us-central1-docker.pkg.dev/jam-duna/importblocks/importblocks:latest
Spining up 'importblocks_container'...
Start Importblocks:
docker exec -it importblocks_container ./importblocks --mode=fallback --http="http://implementation.jamduna.org:8088" --invalidrate=0 --numblocks=100 --statistics=50
importblocks - JAM Duna Import Blocks generator
{
  "Mode": "fallback",
  "HTTP": "http://implementation.jamduna.org:8088",
  "QUIC": "",
  "Verbose": false,
  "NumBlocks": 100,
  "InvalidRate": 0,
  "Statistics": 50,
  "Endpoint": "",
  "Network": "tiny"
}
2025/02/07 21:07:59 [INFO] Starting block generation: mode=fallback, numBlocks=100, dir=/tmp/importBlock
Selected Dir: fallback
Loaded 49 state transitions
Fuzz ready! sources=49
InvalidRate=0.00 -> invalidBlocks=0 | validBlocks=100 | total=100
[#39 e=3,m=003] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#26 e=2,m=002] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#58 e=4,m=010] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#50 e=4,m=002] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#42 e=3,m=006] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#29 e=2,m=005] NotFuzzable  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
...
[#38 e=3,m=002] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#56 e=4,m=008] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#30 e=2,m=006] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#13 e=1,m=001] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#12 e=1,m=000] NotFuzzable  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
2025/02/07 21:08:00 Fuzz completed: 0 invalid blocks, 100 valid blocks
2025/02/07 21:08:19 [fallback Mode]
...
2025/02/07 21:08:33 [fallback Mode] Done in 34.19s
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
importblocks_container
importblocks_container
Pulling Docker Image: us-central1-docker.pkg.dev/jam-duna/importblocks/importblocks:latest
Spining up 'importblocks_container'...
Start Importblocks:
docker exec -it importblocks_container ./importblocks --mode=assurances --http="http://implementation.jamduna.org:8088" --invalidrate=0.31459 --numblocks=100 --statistics=50

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
2025/02/07 21:11:35 [INFO] Starting block generation: mode=assurances, numBlocks=100, dir=/tmp/importBlock
Selected Dir: assurances
Loaded 28 state transitions
Fuzz ready! sources=28
InvalidRate=0.31 -> invalidBlocks=31 | validBlocks=69 | total=100
[#36 e=3,m=000] NotFuzzable  Author: 5e465beb01dbafe160ce8216047f2155dd0569f058afd52dcea601025a8d161d (Idx:0)
[#15 e=1,m=003] NotFuzzable  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#39 e=3,m=003] Fuzzable!!!  Author: aa2b95f7572875b0d0f186552ae745ba8222fc0b5bd456554bfe51c68938f8bc (Idx:2)
[#39 e=3,m=003] Fuzzed with BadCore ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#29 e=2,m=005] Fuzzable!!!  Author: 3d5e5a51aab2b048f8686ecd79712a80e3265a114cc73f14bdb2a59233fb66d0 (Idx:1)
[#29 e=2,m=005] Fuzzed with BadSignature ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
...
[#35 e=2,m=011] Fuzzed with BadCore ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#25 e=2,m=001] Fuzzable!!!  Author: f16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d (Idx:5)
[#25 e=2,m=001] Fuzzed with BadValidatorIndex ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]
[#23 e=1,m=011] Fuzzable!!!  Author: 48e5fcdce10e0b64ec4eebd0d9211c7bac2f27ce54bca6f7776ff6fee86ab3e3 (Idx:4)
[#23 e=1,m=011] Fuzzed with BadCore ouf of 4 possible errors = [BadSignature BadValidatorIndex BadCore BadParentHash]

2025/02/07 21:12:15 Fuzz completed: 31 invalid blocks, 69 valid blocks
2025/02/07 21:12:17 B#002 Fuzzed: BadParentHash
2025/02/07 21:12:18 B#004 Fuzzed: BadCore
2025/02/07 21:12:19 B#010 Fuzzed: BadCore
2025/02/07 21:12:21 B#016 Fuzzed: BadCore
2025/02/07 21:12:22 B#017 Fuzzed: BadValidatorIndex
2025/02/07 21:12:22 B#018 Fuzzed: BadValidatorIndex
2025/02/07 21:12:23 B#021 Fuzzed: BadCore
2025/02/07 21:12:26 B#033 Fuzzed: BadCore
2025/02/07 21:12:28 B#040 Fuzzed: BadValidatorIndex
2025/02/07 21:12:30 B#045 Fuzzed: BadCore
2025/02/07 21:12:30 B#046 Fuzzed: BadValidatorIndex
2025/02/07 21:12:31 B#047 Fuzzed: BadValidatorIndex
2025/02/07 21:12:32 [assurances Mode]
Stats:
{
  "basic": {
    "FuzzedBlocks": 12,
    "FuzzedRate": 0.24,
    "OriginalBlocks": 38,
    "TotalBlocks": 50
  },
  "fuzz": {
    "FalseNegativeRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TruePositiveRate": 1
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TrueNegativeRate": 1
  },
  "overall": {
    "CorrectRate": 1,
    "FlaggedRate": 0.24,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0
  }
}
2025/02/07 21:12:33 B#052 Fuzzed: BadSignature
2025/02/07 21:12:34 B#054 Fuzzed: BadValidatorIndex
2025/02/07 21:12:34 B#055 Fuzzed: BadSignature
2025/02/07 21:12:35 B#057 Fuzzed: BadSignature
2025/02/07 21:12:35 B#058 Fuzzed: BadCore
2025/02/07 21:12:37 B#066 Fuzzed: BadParentHash
2025/02/07 21:12:37 B#067 Fuzzed: BadSignature
2025/02/07 21:12:38 B#069 Fuzzed: BadSignature
2025/02/07 21:12:38 B#070 Fuzzed: BadCore
2025/02/07 21:12:39 B#071 Fuzzed: BadCore
2025/02/07 21:12:39 B#073 Fuzzed: BadValidatorIndex
2025/02/07 21:12:42 B#079 Fuzzed: BadSignature
2025/02/07 21:12:43 B#082 Fuzzed: BadParentHash
2025/02/07 21:12:44 B#084 Fuzzed: BadCore
2025/02/07 21:12:45 B#086 Fuzzed: BadSignature
2025/02/07 21:12:46 B#089 Fuzzed: BadSignature
2025/02/07 21:12:46 B#090 Fuzzed: BadCore
2025/02/07 21:12:47 B#093 Fuzzed: BadValidatorIndex
2025/02/07 21:12:49 B#099 Fuzzed: BadCore
2025/02/07 21:12:49 [assurances Mode]
...
2025/02/07 21:12:49 [assurances Mode] Done in 73.63s
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
    "ResponseErrorRate": 0,
    "TruePositiveRate": 1
  },
  "original": {
    "FalsePositiveRate": 0,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0,
    "TrueNegativeRate": 1
  },
  "overall": {
    "CorrectRate": 1,
    "FlaggedRate": 0.31,
    "MisclassificationRate": 0,
    "ResponseErrorRate": 0
  }
}
```