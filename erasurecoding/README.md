# Erasure encoding test vectors using reed-solomon-simd 3.0.1 matching polkajam

This uses [reed-solomon-simd 3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte alignment) to encode:
* a small work package bundle (268 bytes) 
* a segment (4104) 
in tiny (C=2, V=6) case -- see [GP Appendix H - tiny](https://hackmd.io/@sourabhniyogi/jam-appendixh-tiny) 

The `test_encode_and_decode`  tests a key function `encode` that generates `test_{bundle,segment}_{268,4104}_{tiny}.json` and does a few (3) trials of decoding.

Run the test:

```rust
% cargo test --release --lib -- --nocapture
...
running 1 test
✅ trial 0 succeeded
✅ trial 1 succeeded
✅ trial 2 succeeded
✅ encode+decode SUCCESS — all 3 trials passed for 268 bytes into 6 shards (2 original, 4 recovery)
✅ trial 0 succeeded
✅ trial 1 succeeded
✅ trial 2 succeeded
✅ encode+decode SUCCESS — all 3 trials passed for 4104 bytes into 6 shards (2 original, 4 recovery)
test tests::test_encode_and_decode ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.86s
```

It is desirable to streamline this so that the encoding+decoding does NOT do k separate `encoder.encode` and `decoder.decode` calls, and have GP text updated to match the approach.  In addition, this should be made to work for the "full" (V=1023) case.
