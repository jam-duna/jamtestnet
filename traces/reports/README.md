# Summary

We can import fallback + safrole with matching stateroots, but for reports,

1. 8 out the 18 transitions have PVM accumulation execution problems.

Logs for the 8 may reveal our PVM execution issues as we do not get to
the expected host WRITE (or TRANSFER) calls implied by the keys being
added / removed:

* [00000004.txt](./00000004.txt)
* [00000007.txt](./00000007.txt)
* [00000010.txt](./00000010.txt)
* [00000016.txt](./00000016.txt)
* [00000019.txt](./00000019.txt)
* 00000022.txt
* [00000034.txt](./00000034.txt)
* 00000040.txt


| File            | Key Change Description                           | Result |
|-----------------|--------------------------------------------------|--------------------------------------|
| 00000001.json   |                                                  | OK                                   |
| 00000002.json   |                                                  | OK                                   |
| 00000003.json   |                                                  | OK                                   |
| 00000004.json   | pre 20 => post 26 (6 keys added)                 | "accumulate_gas_used": 59214/1511    |
| 00000005.json   |                                                  | OK                                   |
| 00000006.json   |                                                  | OK                   |
| 00000007.json   | pre 26 => post 21 (5 keys removed)               | "accumulate_gas_used": 98506/4178    |
| 00000008.json   |                                                  | OK                                   |
| 00000009.json   |                                                  | OK                                   |
| 00000010.json   | pre 21 => post 27 (6 keys added)                 | "accumulate_gas_used": 62811/4453    |
| 00000011.json   |                                                  | OK                                   |
| 00000012.json   |                                                  | OK                                   |
| 00000013.json   |                                                  | OK                                   |
| 00000014.json   |                                                  | OK                                   |
| 00000015.json   |                                                  | OK                    |
| 00000016.json   | pre 27 => post 31 (4 new keys)                   | "accumulate_gas_used": 44996/4441    |
| 00000017.json   |                                                  | OK                                   |
| 00000018.json   |                                                  | OK                    |
| 00000019.json   | pre 31 != post 29 (2 keys removed)               | "accumulate_gas_used": 44427/1511    |
| 00000020.json   |                                                  | OK                                   |
| 00000021.json   |                                                  | OK                    |
| 00000022.json   | ---                                              | "accumulate_gas_used": 199999/2866  |
| 00000023.json   |                                                  | OK                                   |
| 00000024.json   |                                                  | OK                                   |
| 00000025.json   |                                                  | OK                                   |
| 00000026.json   |                                                  | OK                                   |
| 00000027.json   |                                                  | OK                                   |
| 00000028.json   |                                                  | OK                                   |
| 00000029.json   |                                                  | OK                                   |
| 00000030.json   |                                                  | OK                    |
| 00000031.json   |                                                  | "accumulate_gas_used": 7901/1416 |
| 00000032.json   |                                                  | OK                                   |
| 00000033.json   |                                                  | OK                    |
| 00000034.json   | pre 29 => post 35 (6 new keys)                   | "accumulate_gas_used": 62777/4453     |
| 00000035.json   |                                                  | OK                                   |
| 00000036.json   |                                                  | OK                                   |
| 00000037.json   |                                                  | OK                                   |
| 00000038.json   |                                                  | OK                                   |
| 00000039.json   |                                                  | OK                    |
| 00000040.json   |  ---                                             | "accumulate_gas_used": 100000/1511  |
| 00000041.json   |                                                  | OK                                   |
| 00000042.json   |                                                  | OK                                   |
