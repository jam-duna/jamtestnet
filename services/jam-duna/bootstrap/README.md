# How to create a JAM New Service using a Bootstrap Service

1. In genesis state,  hard code the bootstrap service 0  with a certain codehash (e.g. `0xbbbb...beef` to create new service with 2 entry points:
	* `refine`: takes the input ${\bf y}$ of a 32-byte codehash, e.g. `0x1234...4321` from the work packages and outputs it (`a10=0xFEFF0004; a11=32;`)
	* `accumulate`: takes the wrangled results and calls host function `new` (`ecalli 9`) which puts a new entropy-driven serviceID into $\omega_7$ if successful.  To report this new service ID (e.g. `42`) to the service creator, this will be followed by a host function `write` (`ecalli 3`)  which writes $\omega_7$ to service 0's key 0

	 We accept that in this minimalist design there is just one new serviceID that could be created on a single core at a time.  For completeness, set up the privileged service state to `(0, 0, 0)` in $C(12)$.   A more elaborate bootstrap service would use `designate`, `empower`, clear ideas on authorization and get the payment model in order.  Here we're just going for minimalist execution.

2. A new service creator (e.g Alice) with a new service (e.g. `fib` with codehash `0x1234...4321`) submits a workpackage to interact with bootstrap service 0, using **[CE 133: Work-package submission](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-133-work-package-submission)** triggering **[CE134 Work-package sharing](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-134-work-package-sharing), [CE137 Shard distribution](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-137-shard-distribution)** and so on  with the same standard guaranteeing/assuring/auditing processes as normal work packages, ultimately resulting in GRANDPA finalization of audited blocks.  But for now, 5 single child descendants works as a place holder for finality for JAM implementers.  For expedience, checking JAM state $C(10)$ holding $\rho$ for the work report to be cleared out of $\rho$ for whatever core received Alice workpackage using service is simple enough to proceed, so as the chain doesn't have any forks.
3. Alice then looks inside service 0's key 0 for its new service ID, e.g. `42`  written at the end of `accumulate` after the service has been accumulated.  We can publicize this key in a JAM testnet.  For now, we'll assume there are no other service creators.  If there were, any service creator could rewind to whatever state root in the state trie and get everyone's service ID, and disambiguate using $C(3)$ holding recent blocks $\beta$ to be sure it was _her_ work package: this acts as the basic "work package receipt" for recent blocks.  
4. Alice now armed with its her serviceID then uses **[CE142 Preimage announcement](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-142-preimage-announcement)** `Service ID ++ Hash ++ Preimage Length` to announce its preimage, running a non-validator node (call it "N6"), sending `42 ++ 0x1234..4321 ++ 242` to all the validator nodes (say, "N0".."N5" in a tiny `V`=6 network).  For N6 to ensure the Preimage is included quickly, this CE142 Preimage announcement should be sent to ALL of N0..N5 nodes in the network since any of them could be authoring the next block.  But it would be fine for N6 to just send to a few, Alice would just have to wait for one of those few to author a block.
5. Validators (who will author a block soon in a smart implementation, or all validators in a lazy implementation) then request the actual preimage of N6 with **[CE143: Preimage Request](https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-143-preimage-request)** with the Preimage Hash received previously and receive the preimage, checking against the Hash, and forming (42, 242 bytes of code hashing to the preimage `0x1234...4321`).  This will be aggregated with other preimages and included in ${\bf E}_P$.   Alice can check new blocks as they are proposed / finalized for inclusion of her preimage and/or look in storage $C(255, 42)$.
6. Alice's service is available for everyone to submit work packages against at the new serviceID (e.g. 42).


### Sketch of bootstrap service code

This is a sketch of what the genesis bootstrap service described above.  This has not been tested yet but we believe this can be executed against.  

Notes:
* `refine` has `codehash` expecting 32 byte payload starting at `0xFEFF0004` because there is 4 bytes of 0 right before the payload ${\bf y}$
* `accumulate` does a `new` and then a `write`


```
pub @refine:
    a10 = 0xFEFF0004 // preceded by $s$
    a11 = 32         // output is 32 bytes, containing the code hash eg 0x1234...4321
    trap

pub @accumulate:
    a7 = 0xFEFF0000 // input is the output of @refine
    a8 = 0          // Figure out sane values of this
    a9 = 0x2000     
    a10 = 0x1000
    a11 = 0x3000
    a12 = 0x4000
    ecalli 9        // new will output a new service key to a7

    // write storage key (0) with new service key value copied from a7 into 0xFEFE0004
    u32 [0xFEFE0000] = 0    // key
    u32 [0xFEFE0004] = a7   // value
    a7 = 0xFEFE0000         // key is 0
    a8 = 4                  // key is 4 bytes
    a9 = 0xFEFE0004         // value is the new serviceID
    a10 = 4                 // value is 4 bytes
    ecalli 3         
    trap

pub @authorization:
    fallthrough

pub @on_transfer:
    fallthrough
```
