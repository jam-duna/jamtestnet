# JAM DUNA Unofficial Import Blocks dataset

[JAM](https://jam.web3.foundation/) is the anticipated future protocol for Polkadot, being implemented by multiple teams across different programming languages. The [JAM Gray Paper](https://graypaper.com/) outlines the protocol, and the Web3 Foundation has shared initial test vectors with participating teams [here](https://github.com/w3f/jamtestvectors).

## Dev Accounts, Chain specs, Genesis States

### Dev Accounts

To support testing in a wide variety of network sizes from "tiny"
(V=6) to "full" (V=1023), we follow the W3F test vectors in having
public secret keys derived deterministically from publicly known
seeds for Ed25519, Bandersnatch, and BLS keys.

Using these seeds, secret and public keys can be programmatically generated, ensuring each JAM team can run the public testnet consistently. This is strictly for development purposes.

An open-source `key` program is used to map seeds into  Bandersnatch/Ed25519/BLS secret and public keys.  See [here](./key) showing how to map any seed.

See [Dev Accounts](https://docs.jamcha.in/basics/dev-accounts) 32-byte seeds.

### Chain Specs

Chain specs for 8 network sizes have been modeled and published.
* [jamtestnet (JSON)](./chainspecs.json)
* [docs.jamcha.in](https://docs.jamcha.in/basics/chain-spec)
* [JAM Chain specs (Google Sheets)](https://docs.google.com/spreadsheets/d/1ueAisCMOx7B-m_fXMLT0FXBxfVzydJyr-udE8jKwDN8/edit?gid=615049643#gid=615049643)


### JAM DUNA 

Nov 2024 - Dec 2025:
* added fallback based on JAM0 meeting
* genesis state fixes [thanks to Daniel from Jamixir] 
* made the phases 3 digits (000, 001, ... 011) rather than variable (0, 1, .. 11) [thank you Boy Maas]
* fixed parent hash to be header hash rather than block hash [thank you Arjan, PyJAMaz]
* mode=orderedaccumulation added (C14+C15)
* 64-bit PVM support with [new opcodes](https://docs.google.com/spreadsheets/d/1R7syeL7GYq4KH2B3Zh03v3CAFnK1iNNF0J4c2r-vKWw/edit?gid=1743195954#gid=1743195954) (with 96% coverage (see [community test vectors](https://github.com/FluffyLabs/jamtestvectors/pull/5)))
* state_transitions output with service k,v metadata

Feb - early March 2025:
* [0.6.2.12 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.2.12)

Late March 2025 - Early April 2025:
* [0.6.4.4 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4)

Late April 2025 - late April 2025:
* [0.6.5.0 Dataset](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.5.0)

May 2025:
* Refactoring [31-byte state keys](https://github.com/gavofyork/graypaper/pull/356) anticipated to be introduced in 0.6.6.x -- see [traces](https://github.com/davxy/jam-test-vectors/pull/45)


## Found an Issue?

Terrific - submit an issue with your findings!   See the [Releases](https://github.com/jam-duna/jamtestnet/releases/tag/0.6.4.4) for how we resolved previous issues with others.   Please avoid sharing code, however, and instead use GP references and links to a specific state transition file.  We have been able solve almost all problems within 48-72 hours or raise questions in the W3F repo or GP Chat room.  In addition, you may find many JAM Implementers here, which are *100% open to all*:

* [Matrix Room - PUBLIC JAM Implementers Room](https://matrix.to/#/!KKOmuUpvYKPcniwOzw:matrix.org?via=matrix.org&via=parity.io)
* [Discord Room - PUBLIC JAM DAO #implementers](https://discord.gg/aGUV82SP)



