# Erasure coding with reed-solomon-simd 3.0.1

This demonstrates use of [reed-solomon-simd
3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte
alignment) to generate test vectors (and check recovery) for all 8
chain specs for a W_G=4104 segment.  Similar test vectors for bundles
of arbitrary length can be published.

This will enable teams to build FFIs against [reed-solomon-simd
3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/) and
participate in a tiny/small/medium/large/xlarge/2xlarge/3xlarge
testnet, with accompanying [JAMNP test
vectors](https://github.com/jam-duna/jamtestnet/pull/109).

It may be desirable to have transformation mirroring Appendix H, which
may be done in these datasets:

* [davxy](https://github.com/davxy/jam-test-vectors/tree/erasure_coding)
* [javajam](https://github.com/javajamio/javajam-trace/tree/main/erasure_coding)

We believe a transformation is _not_ required, and that it is
acceptable to have something that does not do Appendix H
transformations for V<1023 "full".  However, if a transformation is
believed to be required, please submit a PR with matching test vectors.

All that matters is alignment in pre-full configurations.


## Generate test vectors


```
# cargo test test_generate -- --nocapture
   Compiling erasure-coding v0.1.0 (/root/go/src/github.com/jam-duna/jamtestnet/erasurecoding)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.61s
     Running unittests src/lib.rs (target/debug/deps/erasure_coding-cc2b9cff1a650983)

running 1 test
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_tiny.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_small.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_medium.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_large.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_xlarge.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_2xlarge.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_3xlarge.json
Generated segment raw byte length: 4104 bytes
JSON file generated: src/jam-duna/test_segment_shards_full.json
test tests::test_generate ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.15s
```

## Test Restore

```
# cargo test test_restore -- --nocapture
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/erasure_coding-cc2b9cff1a650983)

running 1 test
Restoration successful for src/jam-duna/test_segment_shards_tiny.json
Restoration successful for src/jam-duna/test_segment_shards_small.json
Restoration successful for src/jam-duna/test_segment_shards_medium.json
Restoration successful for src/jam-duna/test_segment_shards_large.json
Restoration successful for src/jam-duna/test_segment_shards_xlarge.json
Restoration successful for src/jam-duna/test_segment_shards_2xlarge.json
Restoration successful for src/jam-duna/test_segment_shards_3xlarge.json
Restoration successful for src/jam-duna/test_segment_shards_full.json
test tests::test_restore ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out; finished in 0.31s
```













