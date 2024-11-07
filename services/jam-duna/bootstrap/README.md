# Creating a JAM New Service using a Bootstrap Service

1. In genesis state,  hard code the bootstrap service 0  with a certain codehash (e.g. `0xbbbb...beef` to create new service with 2 entry points:
	* `refine`: takes the input ${\bf y}$ of a 32-byte codehash, e.g. `0x1234...4321` from the work packages and outputs it (`a10=0xFEFF0004; a11=32;`)
	* `accumulate`: takes the wrangled results and calls host function `new` (`ecalli 9`) which puts a new entropy-driven serviceID into $\omega_7$ if successful.  To report this new service ID (e.g. `42`) to the service creator, this will be followed by a host function `write` (`ecalli 3`)  which writes $\omega_7$ to service 0's key 0

	 We accept that in this minimalist design there is just one new serviceID that could be created on a single core at a time.  For completeness, set up the privileged service state to `(0, 0, 0)` in $C(12)$.   A more elaborate bootstrap service would use `designate`, `empower`, clear ideas on authorization and get the payment model in order.  Here we're just going for minimalist execution.

2. A new service creator (e.g Alice) with a new service (e.g. `fib` with codehash `0x1234...4321`) submits a workpackage to interact with bootstrap service 0, using **[CE 133: Work-package submission](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-133-work-package-submission)** triggering **[CE134 Work-package sharing](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-134-work-package-sharing), [CE137 Shard distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-137-shard-distribution)** and so on  with the same standard guaranteeing/assuring/auditing processes, ultimately resulting in GRANDPA finalization of audited blocks.  But for now, 5 single child descendants works as a placeholder for finality for JAM implementers.  For expedience, checking JAM state $C(10)$ holding $\rho$ for the work report to be cleared out of $\rho$ for whatever core received Alice's workpackage is sufficient to PoC, so long as the chain doesn't develop any forks.
3. Alice then looks inside service 0's key 0 for her new `Service ID`, e.g. `42`, written at the end of `accumulate` after the bootstrap service has been accumulated.  We can publicize the computation key in a JAM testnet so everyone can look in the same place.  For now, we'll assume there are no other service creators.  But if there were, Alice or any other service creator could rewind to whatever state root in the state trie and get everyone's service ID, and disambiguate using $C(3)$ holding recent blocks $\beta$ to be sure it was _their_ work package being report in this key.   This acts as the basic "work package receipt" for the bootstrap service instead of a `ServiceCreated(42)` event in a smart contract setting.  
4. Alice now armed with its her `Service ID` then uses **[CE142 Preimage announcement](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-142-preimage-announcement)** `Service ID ++ Hash ++ Preimage Length` to announce its preimage, running a non-validator node (call it "N6"), sending `42 ++ 0x1234..4321 ++ 242` to all the validator nodes (say, "N0".."N5" in a tiny `V=6` network).  For N6 to ensure the Preimage is included quickly, this CE142 Preimage announcement should be sent to ALL of N0..N5 nodes in the network since any of them could be authoring the next block.  But it would be fine for N6 to just send to a few, Alice would just have to wait for one of those few to author a block: the fewer she sends to, the longer she might have to wait.
5. Validators (who will author a block _soon_ in a smart implementation, or all validators in a _lazy_ implementation) then request the actual preimage from N6 with **[CE143: Preimage Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-143-preimage-request)** with the Preimage Hash received previously and receive the preimage from N6, checking against the Hash, and if it matches, forms (42, 242 bytes of code hashing to the preimage `0x1234...4321`).  This will be aggregated with other preimages and included in ${\bf E}_P$.   Alice can check new blocks as they are proposed / finalized for inclusion of her preimage and/or look in storage $C(255, 42)$ for the newly created service.
6. Alice's service is available for everyone to submit work packages against at the new serviceID (e.g. 42).  

### Implementation of bootstrap service code

* `main.rs` contains an implementation of the above bootstrap service, which is included in the [genesis state](../../../traces/safrole/genesis.json)
   - The `refine` service expects a `codehash` (32 bytes) starting at `0xFEFF0004`
   - The `accumulate` does a `new` and then a `write`
* `bootstrapblob.pvm` has the disassembleable code (see below `polkatool`) with "magic bytes"
* `bootstrap.pvm` has the JAM-ready code blob (no magic bytes).  We used `polkatool` to do this, with [PR #190](https://github.com/paritytech/polkavm/pull/190) actually mapping `main.rs` into the above.  See links: [Building JAM Services in Rust](https://forum.polkadot.network/t/building-jam-services-in-rust/10161) for background


Our test does the following:
* submits a few service code blobs (fib, trib, megatron) in 3 work packages using the bootstrap service "0"
* for each work package, we retrieve the new service indexes left by the `write` after "rho" is cleared (the service has been accumulated)
* our test then runs work packages through fib + trib.  Our next goal is to do ordered accumulation with queues.


```
# cargo run -p polkatool disassemble ~/go/src/github.com/jam-duna/jamtestnet/services/jam-duna/bootstrap/bootstrapblob.pvm  --show-raw-bytes
warning: /root/go/src/github.com/colorfulnotion/polkavm/Cargo.toml: unused manifest key: workspace.lints.rust.unexpected_cfgs.check-cfg
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/polkatool disassemble /root/go/src/github.com/jam-duna/jamtestnet/services/jam-duna/bootstrap/bootstrapblob.pvm --show-raw-bytes`
// RO data = 0/0 bytes
// RW data = 0/0 bytes
// Stack size = 4096 bytes
// Jump table entry point size = 0 bytes
// RO data = []
// RW data = []
// Instructions = 34
// Code size = 115 bytes

      :                          @0
     0: 05 11 00 00 00           jump @4
      :                          @1
     5: 05 10 00 00 00           jump @5
      :                          @2
    10: 05 18 00 00 00           jump @6
      :                          @3
    15: 05 60                    jump @7
      :                          @4 [export #0: 'is_authorized']
    17: 04 07                    a0 = 0x0
    19: 13 00                    ret
      :                          @5 [export #1: 'refine']
    21: 04 0a 04 00 ff fe        a3 = 0xfeff0004
    27: 04 0b 20                 a4 = 0x20
    30: 04 07                    a0 = 0x0
    32: 13 00                    ret
      :                          @6 [export #2: 'accumulate']
    34: 02 11 f8                 sp = sp - 8
    37: 03 10 04                 u32 [sp + 4] = ra
    40: 03 15                    u32 [sp] = s0
    42: 04 05 00 00 ff fe        s0 = 0xfeff0000
    48: 04 07 00 00 ff fe        a0 = 0xfeff0000
    54: 04 08 ce 00              a1 = 0xce
    58: 04 09 00 20              a2 = 0x2000
    62: 04 0a 00 10              a3 = 0x1000
    66: 04 0b 00 30              a4 = 0x3000
    70: 04 0c 00 40              a5 = 0x4000
    74: 4e 09                    ecalli 9 // 'new'
    76: 0d 05                    u32 [s0 + 0] = 0
    78: 03 57 04                 u32 [s0 + 4] = a0
    81: 04 09 04 00 ff fe        a2 = 0xfeff0004
    87: 04 07 00 00 ff fe        a0 = 0xfeff0000
    93: 04 08 04                 a1 = 0x4
    96: 04 0a 04                 a3 = 0x4
    99: 4e 03                    ecalli 3 // 'write'
   101: 01 10 04                 ra = u32 [sp + 4]
   104: 01 15                    s0 = u32 [sp]
   106: 02 11 08                 sp = sp + 0x8
   109: 13 00                    ret
      :                          @7 [export #3: 'on_transfer']
   111: 04 07                    a0 = 0x0
   113: 13 00                    ret
```
