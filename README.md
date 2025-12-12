# JAM DUNA Releases

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared [jamtestvectors](https://github.com/w3f/jamtestvectors) and a basic [jam-conformance](https://github.com/davxy/jam-conformance) fuzzing process.

This repo contains the latest `duna_fuzzer` and `duna_target` (Linux) @ 0.7.2 along with a 0.7.1 test bank.

We are at 0.7.2 conformance, ready to file our M1 report, and are looking for getting multiclient **tiny** testnet with other teams who have Doom WP package refinement and polkajam connectivity.

## Doom Work package refinement

We have gotten very close (down to just 1 byte representing 5 gas diff between child and parent) to matching polkajam's doom!

[Download doom.zip (907MB)](https://cdn.jamduna.org/doom.zip) which is the modular PVM Trace for [doom bundle](https://github.com/jam-duna/jamtestnet/blob/main/examples/doom/refine/04918460_0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02_0_5_guarantor.json) ([state](https://github.com/jam-duna/jamtestnet/blob/main/examples/doom/refine/04918460.json))

See [PVM Modular Tracing](./TRACING.md) for details.

# History

Nov 2024 - Dec 2024:
* initial setup of fallback/safrole datasets, now covered in [this dataset](https://github.com/davxy/jam-test-vectors/pull/45)

Feb - early March 2025:
* [0.6.2.12 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.2.12)

Late March 2025 - Early April 2025:
* [0.6.4.4 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4)

May 2025:
* [0.6.5.2 jamduna binary](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.5.2) 

June 2025:
* First contact with Multiclient JAM Testnet with polkajam + javajam

July 2025:
* 0.6.5 Recompiler success with Doom + Algo 

August 2025:
* 0.6.7.x [Fuzzer + Fuzzer Target](https://github.com/jam-duna/jamtestnet)  released
* Demonstrated approximate parity of recompiler performance on Game of Life, see [Game of Life Recompiler Comparison -- JAM DUNA vs Polkajam](https://docs.google.com/spreadsheets/d/1ZzAhksLEs7mI9jidRvjdnBzbDDqF-oVtrgXQ1_P6t_A/edit?usp=sharing) (data above, raw data from  [jamduna](./0.6.7/game_of_life/jamduna_record.txt) and [polkajam](./0.6.7/game_of_life/polkajam_record.txt)) 

September 2025:
* 0.7.0.x [Fuzzer + Fuzzer Target](https://github.com/jam-duna/jamtestnet) -- now optimizing for [JAM Conformance](https://paritytech.github.io/jam-conformance-dashboard/), implemented fuzzing with refine 

October/November 2025:
* 0.7.1 [jam-test-vectors + jam-conformance PVM traces vectors](https://github.com/jam-duna/jamtestnet) -- trace vectors passed with recompiler

December 2025:
* 0.7.2 with Doom WP refinement (with Go Interpreter, with just one byte difference) + Grandpa finality using CE149-153.

# Got JAM?  Lets JAM!  Lets Conform!  

Terrific - please let everyone know in [JAM Conformance Matrix Room](https://matrix.to/#/#jam-conformance:polkadot.io)
