# Summary

We can import fallback + safrole with matching stateroots, but for reports all the accumulates are failing for us:

```
importblock_test.go:194: ❌ [00000003.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000007.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000011.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000013.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000019.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000021.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000025.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000029.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000035.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000037.json] Test failed: mismatch
importblock_test.go:194: ❌ [00000041.json] Test failed: mismatch
```

We can pass all 0.6.5 accumulate, so these are PVM accumulation execution problems.

We added an `test-stf` capability

```
root@coretime:~/go/src/github.com/colorfulnotion/jam# bin/jamduna test-stf -h
Run the STF Validation

Usage:
  ./jamduna test-stf <input.json> [flags]

Flags:
  -d, --data-path string   Specifies the directory for the blockchain, keystore, and other data. (default "/root/.jamduna")

Global Flags:
  -c, --config string      Path to the config file
  -h, --help               Displays help information about the commands and flags.
  -l, --log-level string   Log level (debug, info, warn, error) (default "debug")
  -t, --temp               Use a temporary data directory, removed on exit. Conflicts with data-path
  -v, --version            Prints the version of the program.
```

so that we can mass generate the PVM execution logs

```
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000003.json > logs/00000003.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000007.json > logs/00000007.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000011.json > logs/00000011.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000013.json > logs/00000013.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000019.json > logs/00000019.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000021.json > logs/00000021.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000025.json > logs/00000025.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000029.json > logs/00000029.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000035.json > logs/00000035.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000037.json > logs/00000037.log 2>&1
bin/jamduna test-stf jamtestvectors/traces/reports-l0/00000041.json > logs/00000041.log 2>&1
```

Our PVM execution logs for all 11 failure are included in htis directory:


```
# ls -lt *.log
-rw-r--r-- 1 root root 517874 May 21 20:27 00000041.log
-rw-r--r-- 1 root root 517431 May 21 20:27 00000037.log
-rw-r--r-- 1 root root 526158 May 21 20:27 00000035.log
-rw-r--r-- 1 root root 520621 May 21 20:27 00000029.log
-rw-r--r-- 1 root root 517431 May 21 20:27 00000025.log
-rw-r--r-- 1 root root 526158 May 21 20:26 00000021.log
-rw-r--r-- 1 root root 530496 May 21 20:26 00000019.log
-rw-r--r-- 1 root root 520896 May 21 20:26 00000013.log
-rw-r--r-- 1 root root 521729 May 21 20:26 00000011.log
-rw-r--r-- 1 root root 522362 May 21 20:26 00000007.log
-rw-r--r-- 1 root root 517703 May 21 20:26 00000003.log
```


### Example: 00000003.log

```
root@coretime:~/go/src/github.com/jam-duna/jamtestnet/traces/reports-l0# more 00000003.log 
DEBUG[05-21|20:25:51.692] SINGLE ACCUMULATE                        s=0 wrangledResults='{"H":"0xe364cdf6a3c2346906d5b6957cfcec16b4e491624b61f2d0dd838610bf0ff27d","E":"0x00000000000000000000000000000000000000000000000
00000000000000000","A":"0x207fa86c31a25c109f8dbbcc8b6300543762be906e00135531107c0d54887e83","O":"QXV0aD08Pg==","Y":"0x5f930c75da61bb2e31b5b9426e3a4d8ff9582cade2dc31c6b202e17cecdd97af","G":100000,"D":"0x0003010500"}'
{"op":"JUMP","mode":"accumulate","step":1,"pc":27543,"gas":100000,"reg":[4294901760,4278059008,0,0,0,0,0,4278124544,153,0,0,0,0]}
{"op":"ADD_IMM_64","mode":"accumulate","step":2,"pc":27546,"gas":99999,"reg":[4294901760,4278058904,0,0,0,0,0,4278124544,153,0,0,0,0]}
{"op":"STORE_IND_U64","mode":"accumulate","step":3,"pc":27549,"gas":99998,"reg":[4294901760,4278058904,0,0,0,0,0,4278124544,153,0,0,0,0]}
{"op":"ADD_IMM_32","mode":"accumulate","step":4,"pc":27551,"gas":99997,"reg":[4294901760,4278058904,0,0,0,0,0,4278124544,153,0,18446744073692708864,0,0]}
{"op":"ADD_IMM_32","mode":"accumulate","step":5,"pc":27553,"gas":99996,"reg":[4294901760,4278058904,0,0,0,0,0,4278124544,153,153,18446744073692708864,0,0]}
{"op":"ADD_IMM_64","mode":"accumulate","step":6,"pc":27556,"gas":99995,"reg":[4294901760,4278058904,0,0,0,0,0,4278058928,153,153,18446744073692708864,0,0]}
{"op":"MOVE_REG","mode":"accumulate","step":7,"pc":27558,"gas":99994,"reg":[4294901760,4278058904,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"LOAD_IMM_JUMP","mode":"accumulate","step":8,"pc":35956,"gas":99993,"reg":[910,4278058904,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"ADD_IMM_64","mode":"accumulate","step":9,"pc":35959,"gas":99992,"reg":[910,4278058800,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"STORE_IND_U64","mode":"accumulate","step":10,"pc":35962,"gas":99991,"reg":[910,4278058800,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"STORE_IND_U64","mode":"accumulate","step":11,"pc":35965,"gas":99990,"reg":[910,4278058800,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"STORE_IND_U64","mode":"accumulate","step":12,"pc":35968,"gas":99989,"reg":[910,4278058800,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"BRANCH_EQ_IMM","mode":"accumulate","step":13,"pc":35972,"gas":99988,"reg":[910,4278058800,0,0,0,0,0,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"MOVE_REG","mode":"accumulate","step":14,"pc":35974,"gas":99987,"reg":[910,4278058800,0,0,0,0,4278058928,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
{"op":"STORE_IND_U64","mode":"accumulate","step":15,"pc":35977,"gas":99986,"reg":[910,4278058800,0,0,0,0,4278058928,4278058928,18446744073692708864,153,18446744073692708864,0,0]}
...

{"op":"LOAD_IND_U64","mode":"accumulate","step":3128,"pc":27663,"gas":96865,"reg":[4294901760,4278058904,15,8,4278056665,0,0,0,0,0,8,55,56]}
{"op":"ADD_IMM_64","mode":"accumulate","step":3129,"pc":27666,"gas":96864,"reg":[4294901760,4278059008,15,8,4278056665,0,0,0,0,0,8,55,56]}
{"op":"JUMP_IND","mode":"accumulate","step":3130,"pc":27666,"gas":96863,"reg":[4294901760,4278059008,15,8,4278056665,0,0,0,0,0,8,55,56]}
DEBUG[05-21|20:25:51.854] BEEFY OK-HALT with yield @SINGLE ACCUMULATE s=0                    B=0x0000000000000000000000000000000000000000000000000000000000000000
DEBUG[05-21|20:25:51.854] ProcessDeferredTransfers                 service=0 gasUsed=0 transferCount=0
writing post-state to poststate.json
Output written to poststate.json/post_state.json
Diff on 1 keys: [0x0d00000000000000000000000000000000000000000000000000000000000000]
========================================
State Key: unknown (0x0d00000000000000000000000000000000000000000000000000000000000000)
unknown    | PreState : 0x010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e79948010000000000000199480000000000000000
unknown    | Expected: 0x010000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000000000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000010000000000000000000000000000000000000001000000010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e7060000000000000100000000000000000000000001a8320000
unknown    | Actual:   0x010000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000000000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000010000000000000000000000000000000000000001000000010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e70600000000000001000000000000000000000000018c420000
========================================
Error running STF Validation: [jamtestvectors/traces/reports-l0/00000003.json] State transition failed with 1 diffs
```

We believe a similar `test-stf` operation in `polkajam` would eliminate the need for time-consuming async trace sharing.

