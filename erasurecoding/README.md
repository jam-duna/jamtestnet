# Erasure encoding test vectors using reed-solomon-simd 3.0.1 matching polkajam

* **Original data** [w3f/jamtestvectors/erasure/tiny](https://github.com/w3f/jamtestvectors/blob/master/erasure/tiny/)

This uses [reed-solomon-simd 3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte alignment) to encode:
* a small work package bundle (268 bytes) 
* a segment (4104) 
in tiny (C=2, V=6) case -- see [GP Appendix H - tiny](https://hackmd.io/@sourabhniyogi/jam-appendixh-tiny) 

The `test_encode_and_decode`  tests a key function `encode` that generates [tiny from w3f/jamtestvectors/erasure/tiny](https://github.com/w3f/jamtestvectors/blob/master/erasure/tiny/).

Run the test:

```rust
 % cargo test --release --lib -- --nocapture
    Finished `release` profile [optimized] target(s) in 0.02s
     Running unittests src/lib.rs (target/release/deps/erasure_coding-653c5adebb436e9a)

running 1 test
test tests::test_encode ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s
```

JAM Implementers can FFI into this package.  However, see [ec-wish branch](https://github.com/jam-duna/jamtestnet/tree/ec-wish) for streamline this so that the encoding+decoding does NOT do k separate `encoder.encode` and `decoder.decode` calls and [graypaper Issue #97](https://github.com/gavofyork/graypaper/issues/97)
