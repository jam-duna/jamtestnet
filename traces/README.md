
# Traces 

Sharing traces of blockchain state is a valuable prerequisite before 2 or more teams can set up a tiny JAM Testnet, to ensure both team can validate
each others state transitions (including state roots) and check each others JAM codec encoding/decoding abilities.  


If your team has a sequence of Blocks + States, please submit a PR going into this directory, containing at minimum easily parsed / decoded files for each `epoch` and $phase`

* Blocks: `$epoch_$phase.json`  `$epoch_$phase.bin` 
* States: `$epoch_$phase.json`  `$epoch_$phase.bin`

The combination of JSON + codec is useful for debugging purposes.

Here is a sample output:
```
# ls safrole/$TEAM_NAME/blocks
349445_0.bin    349445_2.bin   349445_6.bin   349446_0.bin    349446_2.bin   349446_6.bin   349447_0.bin    349447_2.bin   349447_6.bin   349448_0.bin    349448_2.bin   349448_6.bin   349449_0.bin
349445_0.json   349445_2.json  349445_6.json  349446_0.json   349446_2.json  349446_6.json  349447_0.json   349447_2.json  349447_6.json  349448_0.json   349448_2.json  349448_6.json  349449_0.json
349445_1.bin    349445_3.bin   349445_7.bin   349446_1.bin    349446_3.bin   349446_7.bin   349447_1.bin    349447_3.bin   349447_7.bin   349448_1.bin    349448_3.bin   349448_7.bin   349449_1.bin
349445_1.json   349445_3.json  349445_7.json  349446_1.json   349446_3.json  349446_7.json  349447_1.json   349447_3.json  349447_7.json  349448_1.json   349448_3.json  349448_7.json  349449_1.json
349445_10.bin   349445_4.bin   349445_8.bin   349446_10.bin   349446_4.bin   349446_8.bin   349447_10.bin   349447_4.bin   349447_8.bin   349448_10.bin   349448_4.bin   349448_8.bin
349445_10.json  349445_4.json  349445_8.json  349446_10.json  349446_4.json  349446_8.json  349447_10.json  349447_4.json  349447_8.json  349448_10.json  349448_4.json  349448_8.json
349445_11.bin   349445_5.bin   349445_9.bin   349446_11.bin   349446_5.bin   349446_9.bin   349447_11.bin   349447_5.bin   349447_9.bin   349448_11.bin   349448_5.bin   349448_9.bin
349445_11.json  349445_5.json  349445_9.json  349446_11.json  349446_5.json  349446_9.json  349447_11.json  349447_5.json  349447_9.json  349448_11.json  349448_5.json  349448_9.json
# ls safrole/$TEAM_NAME/state_snapshots
349445_0.bin    349445_2.bin   349445_6.bin   349446_0.bin    349446_2.bin   349446_6.bin   349447_0.bin    349447_2.bin   349447_6.bin   349448_0.bin    349448_2.bin   349448_6.bin   349449_0.bin
349445_0.json   349445_2.json  349445_6.json  349446_0.json   349446_2.json  349446_6.json  349447_0.json   349447_2.json  349447_6.json  349448_0.json   349448_2.json  349448_6.json  349449_0.json
349445_1.bin    349445_3.bin   349445_7.bin   349446_1.bin    349446_3.bin   349446_7.bin   349447_1.bin    349447_3.bin   349447_7.bin   349448_1.bin    349448_3.bin   349448_7.bin   349449_1.bin
349445_1.json   349445_3.json  349445_7.json  349446_1.json   349446_3.json  349446_7.json  349447_1.json   349447_3.json  349447_7.json  349448_1.json   349448_3.json  349448_7.json  349449_1.json
349445_10.bin   349445_4.bin   349445_8.bin   349446_10.bin   349446_4.bin   349446_8.bin   349447_10.bin   349447_4.bin   349447_8.bin   349448_10.bin   349448_4.bin   349448_8.bin
349445_10.json  349445_4.json  349445_8.json  349446_10.json  349446_4.json  349446_8.json  349447_10.json  349447_4.json  349447_8.json  349448_10.json  349448_4.json  349448_8.json
349445_11.bin   349445_5.bin   349445_9.bin   349446_11.bin   349446_5.bin   349446_9.bin   349447_11.bin   349447_5.bin   349447_9.bin   349448_11.bin   349448_5.bin   349448_9.bin
349445_11.json  349445_5.json  349445_9.json  349446_11.json  349446_5.json  349446_9.json  349447_11.json  349447_5.json  349447_9.json  349448_11.json  349448_5.json  349448_9.json
```

Teams should be able to take a directory of `$mode/$TEAM_NAME/blocks` and:
- read a genesis state `genesis.json` for the `$mode`
- read blocks/*.bin and decode all blocks successfully with the JAM Codec
- validate each block, checking the stateroot and block hash at a minimum

Here is a sample run of a `validatetraces` that does the above:
```
# ./validatetraces ~/jam-duna/jamtestnet/traces/assurances/jam_duna
VALIDATED Block 349462_0.bin => State 349462_0.bin | [N3] H_t=4193544 H_r=0910..b69d  EpochMarker(η1=151f..3ead)
VALIDATED Block 349462_1.bin => State 349462_1.bin | [N3] H_t=4193545 H_r=27d0..5869   |E_T|=3
VALIDATED Block 349462_2.bin => State 349462_2.bin | [N2] H_t=4193546 H_r=6413..540d   |E_T|=3
VALIDATED Block 349462_3.bin => State 349462_3.bin | [N1] H_t=4193547 H_r=134b..f686   |E_T|=3  |E_G|=1
VALIDATED Block 349462_4.bin => State 349462_4.bin | [N4] H_t=4193548 H_r=4329..66d0   |E_T|=3  |E_A|=5
VALIDATED Block 349462_5.bin => State 349462_5.bin | [N2] H_t=4193549 H_r=5c46..e964   |E_T|=3
VALIDATED Block 349462_6.bin => State 349462_6.bin | [N1] H_t=4193550 H_r=4aaa..94e2   |E_T|=3
VALIDATED Block 349462_7.bin => State 349462_7.bin | [N1] H_t=4193551 H_r=9f96..ceb4 
VALIDATED Block 349462_8.bin => State 349462_8.bin | [N1] H_t=4193552 H_r=3e82..7b05 
VALIDATED Block 349462_9.bin => State 349462_9.bin | [N3] H_t=4193553 H_r=5838..d51c 
VALIDATED Block 349462_10.bin => State 349462_10.bin | [N3] H_t=4193554 H_r=f300..38c6   WinningTickets(12)
VALIDATED Block 349462_11.bin => State 349462_11.bin | [N5] H_t=4193555 H_r=111d..3ca5 
Trace validation completed successfully.
```

Note that JAM codec versions are used, not JSON files.  JSON files are
provided for debugging only.  In particular, JSON object attribute
names to be as close as possible to w3f `codec` test vectors.
However, different teams are likely to choose slightly different JSON
attribute names for some state variables outside the test vectors, so
validation between two teams should be based on the JAM codec files
instead of the JSON content.

## Modes

* For mode `safrole`, only the first 4 epochs are useful or needed following this [JAM Safrole Model](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)

* For mode `assurance`, `finality`, and `conformance` additional epochs may be required using sample work packages.

* Additional modes can be added between based on JAM implementer community interest.

## Notes

This is a PoC at this point and any team submission should not be taken as authoritative in any way.  
