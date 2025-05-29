# Erasure encoding / decoding test vectors using reed-solomon-simd 3.0.1 

This uses [reed-solomon-simd 3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte alignment) to encode and decode:
* a tiny bundle (10)
* a small bundle (272)
* a segment (4104) 
in 2 configurations:
* tiny (C=2, V=6) -- see [GP Appendix H - tiny](https://hackmd.io/@sourabhniyogi/jam-appendixh-tiny) 
* full (C=342, V=1023) -- see [GP Appendix H](https://graypaper.fluffylabs.dev/#/9a08063/394401394401?v=0.6.6) 


The `test_encode_decode`  tests 2 key functions `encode` and `decode_check`:

* `encode` generates `test_{bundle,segment}_{10,272,4104}_{tiny,full}.json` dataset in JSON form
* `decode` reads each of the above JSON files, picks C shards to recover in one of 10 trials, and checks reconstruction against the original dataset

Run the test:

```rust
cargo test -- --nocapture
running 1 test
test tests::test_encode_decode ... ok

successes:

---- tests::test_encode_decode stdout ----
✅ encode SUCCESS 10 bytes into 1023 shards (342 original, 681 recovery) → test_bundle_10_full.json
✅ encode SUCCESS 10 bytes into 6 shards (2 original, 4 recovery) → test_bundle_10_tiny.json
✅ encode SUCCESS 272 bytes into 6 shards (2 original, 4 recovery) → test_bundle_272_tiny.json
✅ encode SUCCESS 4104 bytes into 6 shards (2 original, 4 recovery) → test_segment_4104_tiny.json
✅ encode SUCCESS 272 bytes into 1023 shards (342 original, 681 recovery) → test_bundle_272_full.json
✅ encode SUCCESS 4104 bytes into 1023 shards (342 original, 681 recovery) → test_segment_4104_full.json
✅ decode SUCCESS for test_bundle_10_tiny.json over 10 trials
✅ decode SUCCESS for test_bundle_272_tiny.json over 10 trials
✅ decode SUCCESS for test_segment_4104_tiny.json over 10 trials
✅ decode SUCCESS for test_bundle_10_full.json over 10 trials
✅ decode SUCCESS for test_bundle_272_full.json over 10 trials
✅ decode SUCCESS for test_segment_4104_full.json over 10 trials


successes:
    tests::test_encode_decode

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.05s
```

Teams are encouraged to find issues with GP compliance.  Please submit an PR with your fix. 