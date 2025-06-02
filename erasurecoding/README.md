# Erasure encoding test vectors using reed-solomon-simd 3.0.1 matching polkajam

This uses [reed-solomon-simd 3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte alignment) to encode:
* a small work package bundle (268 bytes) 
* a segment (4104) 
in tiny (C=2, V=6) -- see [GP Appendix H - tiny](https://hackmd.io/@sourabhniyogi/jam-appendixh-tiny) 

The `test_encode`  tests a key functions `encode` that generates `test_{bundle,segment}_{268,4104}_{tiny}.json` 

Run the test:

```rust
   Compiling erasure-coding v0.1.0 (/Users/michael/Desktop/jamtestnet/erasurecoding)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.49s
     Running unittests src/lib.rs (target/debug/deps/erasure_coding-359b9c06d6b8514d)

running 1 test
✅ encode SUCCESS 268 bytes into 6 shards (2 original, 4 recovery) → test_bundle_268_tiny.json
✅ encode SUCCESS 4104 bytes into 6 shards (2 original, 4 recovery) → test_segment_4104_tiny.json
test tests::test_encode ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.10s
```

It is desirable to streamline this and have GP text updated to match the approach.
