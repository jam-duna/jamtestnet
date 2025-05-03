# Summary

We can import fallback + safrole with matching stateroots, but for reports,

1. 18/42 state transitions we have C13 mismatches

2. Of the above 18, 6 out the 18 transitions have PVM execution problems.

Logs for the 6 may reveal our PVM execution issue as we do not get to
the expected host WRITE (or TRANSFER) calls implied by the keys being
added / removed:

* [00000004.txt](./00000004.txt)
* [00000007.txt](./00000007.txt)
* [00000010.txt](./00000010.txt)
* [00000016.txt](./00000016.txt)
* [00000019.txt](./00000019.txt)
* [00000034.txt](./00000034.txt)


| File            | Key Change Description                          | Result                               |
|-----------------|--------------------------------------------------|--------------------------------------|
| 00000001.json   |                                                  | OK                                   |
| 00000002.json   |                                                  | OK                                   |
| 00000003.json   |                                                  | C13 mismatch only                    |
| 00000004.json   | pre 20 => post 26 (6 keys added)                 | C13 mismatch + accumulate failure    |
| 00000005.json   |                                                  | OK                                   |
| 00000006.json   |                                                  | C13 mismatch only                    |
| 00000007.json   | pre 26 => post 21 (5 keys removed)               | C13 mismatch + accumulate failure    |
| 00000008.json   |                                                  | OK                                   |
| 00000009.json   |                                                  | C13 mismatch                         |
| 00000010.json   | pre 21 => post 27 (6 keys added)                 | C13 mismatch + accumulate failure    |
| 00000011.json   |                                                  | OK                                   |
| 00000012.json   |                                                  | OK                                   |
| 00000013.json   |                                                  | OK                                   |
| 00000014.json   |                                                  | OK                                   |
| 00000015.json   |                                                  | C13 mismatch only                    |
| 00000016.json   | pre 27 => post 31 (4 new keys)                   | C13 mismatch + accumulate failure    |
| 00000017.json   |                                                  | OK                                   |
| 00000018.json   |                                                  | C13 mismatch only                    |
| 00000019.json   | pre 31 != post 29 (2 keys removed)               | C13 mismatch + accumulate failure    |
| 00000020.json   |                                                  | OK                                   |
| 00000021.json   |                                                  | C13 mismatch only                    |
| 00000022.json   |                                                  | C13 mismatch only                    |
| 00000023.json   |                                                  | OK                                   |
| 00000024.json   |                                                  | OK                                   |
| 00000025.json   |                                                  | OK                                   |
| 00000026.json   |                                                  | OK                                   |
| 00000027.json   |                                                  | OK                                   |
| 00000028.json   |                                                  | OK                                   |
| 00000029.json   |                                                  | OK                                   |
| 00000030.json   |                                                  | C13 mismatch only                    |
| 00000031.json   |                                                  | C13 mismatch only                    |
| 00000032.json   |                                                  | OK                                   |
| 00000033.json   |                                                  | C13 mismatch only                    |
| 00000034.json   | pre 29 => post 35 (6 new keys)                   | C13 mismatch + accmulate failure     |
| 00000035.json   |                                                  | OK                                   |
| 00000036.json   |                                                  | OK                                   |
| 00000037.json   |                                                  | OK                                   |
| 00000038.json   |                                                  | OK                                   |
| 00000039.json   |                                                  | C13 mismatch only                    |
| 00000040.json   |                                                  | C13 mismatch only                    |
| 00000041.json   |                                                  | OK                                   |
| 00000042.json   |                                                  | OK                                   |
