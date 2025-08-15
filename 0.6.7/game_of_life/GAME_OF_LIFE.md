# Game of Life Test
## execution record with polkajam
### 0x9c4ca7a5ea7a721991d6b23ca0bbc561f024240f95a6a46525fbd66abe20c806
#### jamduna
```
=== VM recompiler Execution Summary (service game_of_life, 12589 bytes, refineGasUsed 73579)===
Phase            Duration       Percent
Initialization   73µs             0.39%
StandardInit     7.941ms         42.95%
Compile          4.773ms         25.82%
Execution        5.647ms         30.54%
Total            18.488ms 
```
#### polkajam
```
2025-08-15 19:39:07 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 73579 gas, took 7.99341ms
2025-08-15 19:39:07 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 73579 gas, took 10.847439ms
```

### 0xb3a62d252511508f7c1a5abd7b4db5929a0ece1db649d45b096c7505fe31adfa
#### jamduna
```
=== VM recompiler Execution Summary (service game_of_life, 12589 bytes, refineGasUsed 104835)===
Phase            Duration       Percent
Initialization   48µs             0.08%
StandardInit     8.651ms         14.59%
Compile          4.427ms          7.47%
Execution        46.098ms        77.75%
Total            59.292ms
```
#### polkajam
```
2025-08-15 19:41:04 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 104835 gas, took 62.412595ms
2025-08-15 19:41:04 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 104835 gas, took 63.517304ms
```

### 0x097105ec178ab63afc70b4564cba19d7c7179cbfddc77836a0c2012359c9e0a
#### jamduna
```
=== VM recompiler Execution Summary (service game_of_life, 12589 bytes, refineGasUsed 105621)===
Phase            Duration       Percent
Initialization   53µs             0.09%
StandardInit     11.737ms        18.99%
Compile          8.793ms         14.23%
Execution        41.164ms        66.61%
Total            61.803ms
```
#### polkajam
```
2025-08-15 19:43:03 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 105621 gas, took 44.295396ms
2025-08-15 19:43:03 tokio-runtime-worker DEBUG chain-core  Refine OK with result: Ok("") using 105621 gas, took 46.538596ms
```

for more information pls see `record`