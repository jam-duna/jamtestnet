# JAM Refine and Accumulate "Modular" Tracing

This document is a draft of "modular" JAM PVM Tracing with links to 0.7.2 PoC examples (doom + fuzzy), following through on a suggestion by [Jan Bujak](https://github.com/koute) ([PolkaVM](https://github.com/paritytech/polkavm) inventor/architect) to use flat "modular" files in a review of the [JIP-6 PVM Execution Traces](https://github.com/tomusdrw/JIPs/pull/1#issuecomment-3637030827).  

Key ideas:

* The logs are now modular in that if anyone wants to add another new stream/field, they just add a new file. Those who are interested in that stream can parse it, and those who aren't can ignore it.
* Implementations only write and read what they can from a set of streams.
* Allows for efficient O(1) seeking across the logs and efficient O(log N) bisection of logs. Constant-width is pursued when practical accordingly.
* Metadata, Inputs/outputs (including work package bundles + reports and argument inputs/outputs) are kept in additional files to support rapid comparison between different implementations to check whether you disagree (and maybe even narrow down where exactly, e.g. only your gas_remaining file might be different, so you'd know that your gas accounting is broken), without having to share all of the logs.
* Allows for better compression, since similar data is now going to be next to each other.

As JAM `refine` and `accumulate` involve many PVM invocations (authorization and work items (potentially with multiple child machine invocations which may be expunged), multiple ordered parallel accumulation), it is natural to combine Trace Streams with hierarchical directory structures, keyed in by work package hash or accumulate time slot.  Within each directory, we may nest Trace Streams, the invocation inputs (argument inputs and fetch inputs) and outputs (argument outputs and exports) as well as any derivations, or whatever else anyone can think of.

This is just a draft and a community effort, intended first and foremost to save debugging time in support of JAM conformance. A workshop in late December or early January after we've done some real comparisons could be useful to support increased alignment.

## Trace Streams

A single PVM can be used in JAM for authorization of a work package, refining a work item, or performing a single accumulation as part of multiple parallelized accumulates.  

* Each stream gets one file per PVM created; each instruction contributes one record in every stream. 
* All data is in **little-endian** (unless otherwise noted!)
* Files should use lowercase names. If a file is compressed, the extension of the file should reveal the compression scheme (eg `.gz` stream is gzip-compressed binary data.) 

| Streams     | Entry width | Meaning                                                                                              |
|-------------|-------------|------------------------------------------------------------------------------------------------------|
| `opcode`     | 1 byte (`uint8`) | Opcode executing the step.  |
| `pc`     | 8 bytes (`uint64`) | Program counter *before* executing the step. |
| `r0`..`r12` | 8 bytes (`uint64`) | Register snapshot *after* executing the step. |
| `gas`    | 8 bytes (`uint64`) | Remaining gas after the step. |
| `loads`   | 12 bytes (`uint32` + `uint64`) | Address + value of a memory load (0 for both when no load occurred) |
| `stores` | 12 bytes (`uint32` + `uint64`) | Address + value of a memory write (0 for both when no store occurred) |

Important: Please suggest additional streams (`ecalli`, `hostwrites`, `hostreads`, `registers-and-gas`, `codehash`, `service`, etc.) -- there are multiple ways of doing everything.  The goal is fast debugging, so partial and potentially redundant views are OK.  

Tips:
* use buffers to write N million steps at a time
* write compressed data

Discussion: 
* pre vs post decisioning
* host function reads/writes
* ...

## Refine

Refine has one authorization followed by work items, each of which may involve some number of child machines which can be put into directory+files like this:

- `<work package hash>/`  
  - `auth/`: PVM trace data for the authorization step in one subfolder 
  - `bundle`
  - `<workItemIndex>_<serviceId>/`: PVM trace data, one subfolder per work item containing:
      - `input`: refine input
      - `exports`: concatenated exported segments (present only if anything was exported).
      - `child_<n>_<m>/`: trace streams for nested VM invocations
  - `bclubs`
  - `sclubs`
  - `bundle_chunks`
  - `segment_chunks`
  - `workreportderivation.json`: the above 4 elements in JSON form.  TODO: workshop to dive into the many components here. 
  - `workreport` 

For child invocations:
* `n` is the child slot/handle assigned when the host creates the VM and
* `m` counts how many times that slot has been recycled. 
When a child is expunged and the same slot later provisions a fresh VM (via a new `machine` call), the counter increments and the next folder becomes `child_<n>_<m+1>`.

Notes:
- Any `.bin` or `.json` extensions imply JAM Codec and canonical JSON encoding, same as the W3F test vectors

### Additional streams

1. These are used in refine `fetch` host calls and are not included in the work package bundle:
 - `parameters`  (see `fetch` 0)
 - `entropy`   (see `fetch`  1)
 - `authorization`  (see `fetch`  2)

2. Additionally, JAM-encoded versions of the following _could_ be useful, although redundant with the `bundle`:
 - `extrinsics` (see `fetch`  3, 4)
 - `imported_segments` (see `fetch`  5, 6)
 - `work_package` (see `fetch` 7 )
 - `authorization_code` (see `fetch` 8)
 - `configuration_blob` (see `fetch` 8)
 - `authorization_token`  (see `fetch` 9)
 - `refine_context` (see `fetch` 10)
 - `work_item` (see `fetch` 11, 12)
 - `payload` (see `fetch` 13)

#### Doom Example

We have compiled our trace for Doom here: [0.7.2 Doom (last update:12/17/2025) - JAM DUNA](https://cdn.jamduna.org/doom.zip) - 907MB

This is the very first work package from the polkajam `jamt` 

This is _very_ fresh, we're still checking our work, so don't take it too seriously _yet_.  We are off by just ONE byte in the result and you can use this to get a sense of what is going on and try programming your refine to match and generate similar outputs right now!

Directory structure:

```
0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/
├── 0_39711455/                    # work item 0, service 39711455
│   ├── child_0_0/                 # child VM slot 0, instance 0
│   │   ├── gas.gz
│   │   ├── loads.gz
│   │   ├── opcode.gz
│   │   ├── pc.gz
│   │   ├── r0.gz ... r12.gz
│   │   └── stores.gz
│   ├── exports
│   ├── input
│   ├── output
│   └── ... (trace files)
├── auth/                          # authorization PVM trace
│   ├── gas.gz
│   ├── input
│   ├── loads.gz
│   ├── opcode.gz
│   ├── pc.gz
│   ├── r0.gz ... r12.gz
│   └── stores.gz
├── bclubs
├── bundle.bin
├── bundle.json
├── bundle_chunks
├── sclubs
├── segment_chunks
├── workreport.bin
├── workreport.json
└── workreportderivation.json
```

Directory sizes:

```
%du -h 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02
831M	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455/child_0_0
1.7G	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455
80K	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/auth
1.8G	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02
% ls -lt doom.zip
-rw-r--r--  1 michael  staff  951338148 Dec 12 13:00 doom.zip
```

 ## Accumulate

Accumulation involves ordered executions of multiple parallel single accumulations.  Using 0-based `ordered_accumulation_index`, we have a simple subfolder per single service accumulation for each ordered accumulation as follows:

- `<timeslot>/`
   - `<ordered_accumulation_index>/`
      - `<service_id>/`: PVM trace data, one subfolder
         - `input`: accumulate input (t,s,|o|)
         - `accumulate_inputs`: accumulate inputs (see `fetch` 14, 15)
         - `output` or `err`: accumulate output

**Note**: The directory path `x/y` means `parallel_x/single_y` (i.e., ordered accumulation index x, service ID y).

Additional streams could be:
* `state_updates` - instead of all key-values, just the keys and values actually updated
* `accumulate_output` - as incorporated into MMR 
* `post_state_root` 

Please suggest others!  

**Example**: [0.7.2/fuzzy/00000151](https://github.com/jam-duna/jamtestnet/tree/main/jam-test-vectors/0.7.2/fuzzy/00000151)

Directory structure:

```
fuzzy/00000151/
├── 0                          # ordered_accumulation_index = 0
│   ├── 0                      # service_id = 0
│   │   ├── accumulate_input
│   │   ├── gas.gz
│   │   ├── input
│   │   ├── loads.gz
│   │   ├── opcode.gz
│   │   ├── pc.gz
│   │   ├── r0.gz ... r12.gz
│   │   └── stores.gz
│   ├── 393815649              # service_id = 393815649
│   │   ├── accumulate_input
│   │   ├── err
│   │   └── ... (trace files)
│   └── 3953987649             # service_id = 3953987649
│       ├── accumulate_input
│       ├── err
│       └── ... (trace files)
└── 1                          # ordered_accumulation_index = 1
    └── 1858391252             # service_id = 1858391252
        ├── accumulate_input
        ├── output
        └── ... (trace files)
```

File sizes:

```
% ls -l fuzzy/00000151/*/*
fuzzy/00000151/0/0:
total 400
-rw-r--r--  1 michael  staff    462 Dec 17 15:41 accumulate_input
-rw-r--r--  1 michael  staff  43244 Dec 17 15:41 gas.gz
-rw-r--r--  1 michael  staff      4 Dec 17 15:41 input
-rw-r--r--  1 michael  staff  25613 Dec 17 15:41 loads.gz
-rw-r--r--  1 michael  staff   2859 Dec 17 15:41 opcode.gz
-rw-r--r--  1 michael  staff  14736 Dec 17 15:41 pc.gz
-rw-r--r--  1 michael  staff   2767 Dec 17 15:41 r0.gz
-rw-r--r--  1 michael  staff   2225 Dec 17 15:41 r1.gz
-rw-r--r--  1 michael  staff   5226 Dec 17 15:41 r10.gz
-rw-r--r--  1 michael  staff   3908 Dec 17 15:41 r11.gz
-rw-r--r--  1 michael  staff   2946 Dec 17 15:41 r12.gz
-rw-r--r--  1 michael  staff   1477 Dec 17 15:41 r2.gz
-rw-r--r--  1 michael  staff   1282 Dec 17 15:41 r3.gz
-rw-r--r--  1 michael  staff   1757 Dec 17 15:41 r4.gz
-rw-r--r--  1 michael  staff   4112 Dec 17 15:41 r5.gz
-rw-r--r--  1 michael  staff   4355 Dec 17 15:41 r6.gz
-rw-r--r--  1 michael  staff   7017 Dec 17 15:41 r7.gz
-rw-r--r--  1 michael  staff   7883 Dec 17 15:41 r8.gz
-rw-r--r--  1 michael  staff   5197 Dec 17 15:41 r9.gz
-rw-r--r--  1 michael  staff  20556 Dec 17 15:41 stores.gz

fuzzy/00000151/0/393815649:
total 272
-rw-r--r--  1 michael  staff    399 Dec 17 15:41 accumulate_input
-rw-r--r--  1 michael  staff      1 Dec 17 15:41 err
-rw-r--r--  1 michael  staff  20492 Dec 17 15:41 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 17 15:41 input
-rw-r--r--  1 michael  staff  13760 Dec 17 15:41 loads.gz
-rw-r--r--  1 michael  staff   2503 Dec 17 15:41 opcode.gz
-rw-r--r--  1 michael  staff   9850 Dec 17 15:41 pc.gz
-rw-r--r--  1 michael  staff   1457 Dec 17 15:41 r0.gz
-rw-r--r--  1 michael  staff    948 Dec 17 15:41 r1.gz
-rw-r--r--  1 michael  staff   3247 Dec 17 15:41 r10.gz
-rw-r--r--  1 michael  staff   2606 Dec 17 15:41 r11.gz
-rw-r--r--  1 michael  staff   2505 Dec 17 15:41 r12.gz
-rw-r--r--  1 michael  staff    979 Dec 17 15:41 r2.gz
-rw-r--r--  1 michael  staff    890 Dec 17 15:41 r3.gz
-rw-r--r--  1 michael  staff   1158 Dec 17 15:41 r4.gz
-rw-r--r--  1 michael  staff   2175 Dec 17 15:41 r5.gz
-rw-r--r--  1 michael  staff   2371 Dec 17 15:41 r6.gz
-rw-r--r--  1 michael  staff   3137 Dec 17 15:41 r7.gz
-rw-r--r--  1 michael  staff   5002 Dec 17 15:41 r8.gz
-rw-r--r--  1 michael  staff   2799 Dec 17 15:41 r9.gz
-rw-r--r--  1 michael  staff  11280 Dec 17 15:41 stores.gz

fuzzy/00000151/0/3953987649:
total 240
-rw-r--r--  1 michael  staff    200 Dec 17 15:41 accumulate_input
-rw-r--r--  1 michael  staff      1 Dec 17 15:41 err
-rw-r--r--  1 michael  staff  15833 Dec 17 15:41 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 17 15:41 input
-rw-r--r--  1 michael  staff  10855 Dec 17 15:41 loads.gz
-rw-r--r--  1 michael  staff   2240 Dec 17 15:41 opcode.gz
-rw-r--r--  1 michael  staff   8532 Dec 17 15:41 pc.gz
-rw-r--r--  1 michael  staff   1119 Dec 17 15:41 r0.gz
-rw-r--r--  1 michael  staff    772 Dec 17 15:41 r1.gz
-rw-r--r--  1 michael  staff   2211 Dec 17 15:41 r10.gz
-rw-r--r--  1 michael  staff   1841 Dec 17 15:41 r11.gz
-rw-r--r--  1 michael  staff   1649 Dec 17 15:41 r12.gz
-rw-r--r--  1 michael  staff    655 Dec 17 15:41 r2.gz
-rw-r--r--  1 michael  staff    668 Dec 17 15:41 r3.gz
-rw-r--r--  1 michael  staff    797 Dec 17 15:41 r4.gz
-rw-r--r--  1 michael  staff   1626 Dec 17 15:41 r5.gz
-rw-r--r--  1 michael  staff   1591 Dec 17 15:41 r6.gz
-rw-r--r--  1 michael  staff   2616 Dec 17 15:41 r7.gz
-rw-r--r--  1 michael  staff   3895 Dec 17 15:41 r8.gz
-rw-r--r--  1 michael  staff   2198 Dec 17 15:41 r9.gz
-rw-r--r--  1 michael  staff   8364 Dec 17 15:41 stores.gz

fuzzy/00000151/1/1858391252:
total 208
-rw-r--r--  1 michael  staff    154 Dec 17 15:41 accumulate_input
-rw-r--r--  1 michael  staff  10070 Dec 17 15:41 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 17 15:41 input
-rw-r--r--  1 michael  staff   6832 Dec 17 15:41 loads.gz
-rw-r--r--  1 michael  staff   1597 Dec 17 15:41 opcode.gz
-rw-r--r--  1 michael  staff     32 Dec 17 15:41 output
-rw-r--r--  1 michael  staff   6646 Dec 17 15:41 pc.gz
-rw-r--r--  1 michael  staff    662 Dec 17 15:41 r0.gz
-rw-r--r--  1 michael  staff    437 Dec 17 15:41 r1.gz
-rw-r--r--  1 michael  staff   1368 Dec 17 15:41 r10.gz
-rw-r--r--  1 michael  staff   1131 Dec 17 15:41 r11.gz
-rw-r--r--  1 michael  staff   1591 Dec 17 15:41 r12.gz
-rw-r--r--  1 michael  staff    341 Dec 17 15:41 r2.gz
-rw-r--r--  1 michael  staff    350 Dec 17 15:41 r3.gz
-rw-r--r--  1 michael  staff    443 Dec 17 15:41 r4.gz
-rw-r--r--  1 michael  staff   1201 Dec 17 15:41 r5.gz
-rw-r--r--  1 michael  staff   1995 Dec 17 15:41 r6.gz
-rw-r--r--  1 michael  staff   1911 Dec 17 15:41 r7.gz
-rw-r--r--  1 michael  staff   2720 Dec 17 15:41 r8.gz
-rw-r--r--  1 michael  staff   1914 Dec 17 15:41 r9.gz
-rw-r--r--  1 michael  staff   5146 Dec 17 15:41 stores.gz
```
