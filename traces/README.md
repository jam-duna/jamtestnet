
# Traces 

Sharing traces of blockchain state is a valuable prerequisite before 2 or more teams can set up a tiny JAM Testnet, to ensure both team can validate
each others state transitions (including state roots) and check each others JAM codec encoding/decoding abilities.  


If your team has a sequence of Blocks + States, please submit a PR going into this directory, containing at minimum easily parsed / decoded files for each `epoch` and $phase`

* Blocks: `$epoch_$phase.json`  `$epoch_$phase.codec` 
* States: `$epoch_$phase.json`  `$epoch_$phase.codec`

The combination of JSON + codec is useful for debugging purposes.

Here is a sample output:
```
# ls safrole/$TEAM_NAME/blocks/
0_0.codec   0_11.json  0_5.codec  0_8.json   1_10.codec  1_3.json   1_7.codec  2_0.json    2_2.codec  2_5.json   2_9.codec   3_10.json   3_4.codec  3_7.json
0_0.json    0_2.codec  0_5.json   0_9.codec  1_10.json   1_4.codec  1_7.json   2_1.codec   2_2.json   2_6.codec  2_9.json    3_11.codec  3_4.json   3_8.codec
0_1.codec   0_2.json   0_6.codec  0_9.json   1_11.codec  1_4.json   1_8.codec  2_1.json    2_3.codec  2_6.json   3_0.codec   3_11.json   3_5.codec  3_8.json
0_1.json    0_3.codec  0_6.json   1_0.codec  1_11.json   1_5.codec  1_8.json   2_10.codec  2_3.json   2_7.codec  3_0.json    3_2.codec   3_5.json   3_9.codec
0_10.codec  0_3.json   0_7.codec  1_0.json   1_2.codec   1_5.json   1_9.codec  2_10.json   2_4.codec  2_7.json   3_1.codec   3_2.json    3_6.codec  3_9.json
0_10.json   0_4.codec  0_7.json   1_1.codec  1_2.json    1_6.codec  1_9.json   2_11.codec  2_4.json   2_8.codec  3_1.json    3_3.codec   3_6.json   4_0.codec
0_11.codec  0_4.json   0_8.codec  1_1.json   1_3.codec   1_6.json   2_0.codec  2_11.json   2_5.codec  2_8.json   3_10.codec  3_3.json    3_7.codec  4_0.json

# ls safrole/$TEAM_NAME/state_snapshots/
0_0.codec   0_11.json  0_5.codec  0_8.json   1_10.codec  1_3.json   1_7.codec  2_0.json    2_2.codec  2_5.json   2_9.codec   3_10.json   3_4.codec  3_7.json
0_0.json    0_2.codec  0_5.json   0_9.codec  1_10.json   1_4.codec  1_7.json   2_1.codec   2_2.json   2_6.codec  2_9.json    3_11.codec  3_4.json   3_8.codec
0_1.codec   0_2.json   0_6.codec  0_9.json   1_11.codec  1_4.json   1_8.codec  2_1.json    2_3.codec  2_6.json   3_0.codec   3_11.json   3_5.codec  3_8.json
0_1.json    0_3.codec  0_6.json   1_0.codec  1_11.json   1_5.codec  1_8.json   2_10.codec  2_3.json   2_7.codec  3_0.json    3_2.codec   3_5.json   3_9.codec
0_10.codec  0_3.json   0_7.codec  1_0.json   1_2.codec   1_5.json   1_9.codec  2_10.json   2_4.codec  2_7.json   3_1.codec   3_2.json    3_6.codec  3_9.json
0_10.json   0_4.codec  0_7.json   1_1.codec  1_2.json    1_6.codec  1_9.json   2_11.codec  2_4.json   2_8.codec  3_1.json    3_3.codec   3_6.json   4_0.codec
0_11.codec  0_4.json   0_8.codec  1_1.json   1_3.codec   1_6.json   2_0.codec  2_11.json   2_5.codec  2_8.json   3_10.codec  3_3.json    3_7.codec  4_0.json
```

Teams should be able to take a directory of `$mode/$TEAM_NAME/blocks` and:
- read a genesis state `genesis.json` for the `$mode`
- read blocks/*.codec and decode all blocks successfully
- validate each block, checking the stateroot and block hash at a minimum

Note: For JSON, the intention is for JSON object attribute names to be as
close as possible to w3f `codec` test vectors.  However, different
teams are likely to choose slightly different JSON attribute names for
some state outside the test vectors, so validation between the two
teams should be based on the JAM codec files instead of the JSON
content. The JSON should be used solely for supporting conversations
and ease of debugging.


## Modes

* For mode `safrole`, only the first 4 epochs are useful or needed following this [JAM Safrole Model](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)

* For mode `assurance`, `finality`, and `conformance` additional epochs may be required using sample work packages.

## Notes

This is a PoC at this point and any team submission should not be taken as authoritative in any way.  

