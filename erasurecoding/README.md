# Erasure encoding with reed-solomon-simd 3.0.1 to match polkajam

This attempts use of [reed-solomon-simd 3.0.1](https://docs.rs/reed-solomon-simd/3.0.1/reed_solomon_simd/)
(which supports 2-byte alignment and no longer requires 64 byte alignment) to encode a bundle and generate the same 6 shards as observed from a polkajam guarantor in a tiny test, who must respond to CE137 requests for any of the 6 shard indexes.

[`test_segment_shards_tiny_polkajam.json`](./test_segment_shards_tiny_polkajam.json) has the original data (shards 0 and 1) and 4 additional shards (shards 2,3,4,5), obtained by:
* setting up a 5+1 polkajam + jamduna testnet, and modifying the jamduna node get all 6 shards with CE137 requests from the guarantor upon a CE135 Work Report distribution.
* running `jamt` for some new service
* recording all 6 shards from the CE137 response

The test here takes the file, reads the work package bundle, attempts to do a transformation, encodes the data, and checks if the encoding matches that of the the guarantor.

The goal is figure out the exact transformation required for tiny (if any) to generate the 4 additional shards.

Currently, we don't know what the exact transformation is to pass this test:

```rust
cargo test -- --nocapture
```
