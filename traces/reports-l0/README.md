# Summary

We can import fallback + safrole with matching stateroots, but for reports have small gas differences, which we believe are related to single blocks of code not being run due to some host function call issue on our side:

```
importblock_test.go:194: ❌ [00000003.json] Test failed: mismatch  "accumulate_gas_used": 10260 vs 10256 (diff 4)
importblock_test.go:194: ❌ [00000007.json] Test failed: mismatch  "accumulate_gas_used": 44137 vs 44129 (diff 8)
importblock_test.go:194: ❌ [00000011.json] Test failed: mismatch  "accumulate_gas_used": 77678 vs 77668 (diff 10)
importblock_test.go:194: ❌ [00000019.json] Test failed: mismatch  "accumulate_gas_used": 77475 vs 77170 (diff 305)
importblock_test.go:194: ❌ [00000013.json] Test failed: mismatch  "accumulate_gas_used": 33734 vs 33433 (diff 301)
importblock_test.go:194: ❌ [00000021.json] Test failed: mismatch  "accumulate_gas_used": 33546 vs 33245 (diff 301)
importblock_test.go:194: ❌ [00000025.json] Test failed: mismatch  "accumulate_gas_used": 10627 vs 10328 (diff 299)
importblock_test.go:194: ❌ [00000029.json] Test failed: mismatch  "accumulate_gas_used": 55449 vs 55441 (diff 8)
importblock_test.go:194: ❌ [00000035.json] Test failed: mismatch  "accumulate_gas_used": 33590 vs 33289 (diff 301)
importblock_test.go:194: ❌ [00000037.json] Test failed: mismatch  "accumulate_gas_used": 10627 vs 10328 (diff 299)
importblock_test.go:194: ❌ [00000041.json] Test failed: mismatch  "accumulate_gas_used": 99998 vs 100000 (diff -2)
```

We can pass all 0.6.5 accumulate, so these are PVM accumulation execution problems, where programmatically comparable traces (since there are 10K-100K lines) would assist in diagnosis.

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

Our PVM execution logs for all 11 failure are included in this directory, containing `step`, `pc`, `g`, `Registers` and opcode -- a "cut" operation maks for easy extraction


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
...
JUMP               step:     0 pc:     5 g:100000 Registers:[4294901760, 4278059008, 0, 0, 0, 0, 0, 4278124544, 147, 0, 0, 0, 0]
ADD_IMM_64         step:     1 pc: 27543 g: 99999 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278124544, 147, 0, 0, 0, 0]
STORE_IND_U64      step:     2 pc: 27546 g: 99998 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278124544, 147, 0, 0, 0, 0]
ADD_IMM_32         step:     3 pc: 27549 g: 99997 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278124544, 147, 0, 18446744073692708864, 0, 0]
ADD_IMM_32         step:     4 pc: 27551 g: 99996 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278124544, 147, 147, 18446744073692708864, 0, 0]
ADD_IMM_64         step:     5 pc: 27553 g: 99995 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278058928, 147, 147, 18446744073692708864, 0, 0]
MOVE_REG           step:     6 pc: 27556 g: 99994 Registers:[4294901760, 4278058904, 0, 0, 0, 0, 0, 4278058928, 18446744073692708864, 147, 18446744073692708864, 0, 0]
LOAD_IMM_JUMP      step:     7 pc: 27558 g: 99993 Registers:[910, 4278058904, 0, 0, 0, 0, 0, 4278058928, 18446744073692708864, 147, 18446744073692708864, 0, 0]
LOAD_IMM           step: 10246 pc: 27658 g: 89748 Registers:[912, 4278058904, 4278056752, 24, 68695, 0, 0, 0, 0, 9223372036854775800, 1, 46, 2290]
LOAD_IND_U64       step: 10247 pc: 27660 g: 89747 Registers:[4294901760, 4278058904, 4278056752, 24, 68695, 0, 0, 0, 0, 9223372036854775800, 1, 46, 2290]
ADD_IMM_64         step: 10248 pc: 27663 g: 89746 Registers:[4294901760, 4278059008, 4278056752, 24, 68695, 0, 0, 0, 0, 9223372036854775800, 1, 46, 2290]
JUMP_IND           step: 10249 pc: 27666 g: 89745 Registers:[4294901760, 4278059008, 4278056752, 24, 68695, 0, 0, 0, 0, 9223372036854775800, 1, 46, 2290]
terminated

DEBUG[05-23|13:12:51.524] BEEFY OK-HALT with yield @SINGLE ACCUMULATE s=0                    B=0x0000000000000000000000000000000000000000000000000000000000000000
DEBUG[05-23|13:12:51.524] ProcessDeferredTransfers                 service=0 gasUsed=0 transferCount=0
writing post-state to poststate.json
Output written to poststate.json
Diff on 1 keys: [0x0d00000000000000000000000000000000000000000000000000000000000000]
========================================
State Key: unknown (0x0d00000000000000000000000000000000000000000000000000000000000000)
unknown    | PreState : 0x010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e79934010000000000000199340000000000000000
unknown    | Expected: 0x010000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000000000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000010000000000000000000000000000000000000001000000010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e7060000000000000100000000000000000000000001a8140000
unknown    | Actual:   0x010000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000000000000000000000000000000000000000000001000000000000000000000000000000000000000100000001000000010000000000000000000000000000000000000001000000010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080e7060000000000000100000000000000000000000001a8100000
========================================
Error running STF Validation: [jamtestvectors/traces/reports-l0/00000003.json] State transition failed with 1 diffs
```

We believe a similar `test-stf` operation in `polkajam` would eliminate the need for time-consuming async trace sharing.

