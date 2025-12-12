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

We have compiled our trace for Doom here: [0.7.2 Doom 12/12/2025 - JAM DUNA](https://cdn.jamduna.org/doom.zip) - 907MB

This is the very first work package from the polkajam `jamt` 

This is _very_ fresh, we're still checking our work, so don't take it too seriously _yet_.  We are off by just ONE byte in the result and you can use this to get a sense of what is going on and try programming your refine to match and generate similar outputs right now!

You can see the relative sizes here for the non-gz and gz files here:

```
% ls -l 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02  
total 175232
drwxr-xr-x  24 michael  staff       768 Dec 12 12:47 0_39711455
drwxr-xr-x  21 michael  staff       672 Dec 12 12:39 auth
-rw-r--r--@  1 michael  staff       192 Dec 12 12:47 bclubs
-rw-r--r--   1 michael  staff       428 Dec 12 12:39 bundle.bin
-rw-r--r--   1 michael  staff      1582 Dec 12 12:39 bundle.json
-rw-r--r--@  1 michael  staff      1284 Dec 12 12:47 bundle_chunks
-rw-r--r--@  1 michael  staff       192 Dec 12 12:47 sclubs
-rw-r--r--@  1 michael  staff  38413440 Dec 12 12:47 segment_chunks
-rw-r--r--@  1 michael  staff     17280 Dec 12 12:47 workreport.bin
-rw-r--r--@  1 michael  staff     35276 Dec 12 12:47 workreport.json
-rw-r--r--@  1 michael  staff  51220985 Dec 12 12:47 workreportderivation.json
% ls -l 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/auth 
total 152
-rw-r--r--  1 michael  staff  30 Dec 12 12:39 gas.gz
-rw-r--r--  1 michael  staff   1 Dec 12 12:39 input
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 loads.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 opcode.gz
-rw-r--r--  1 michael  staff  24 Dec 12 12:39 pc.gz
-rw-r--r--  1 michael  staff  25 Dec 12 12:39 r0.gz
-rw-r--r--  1 michael  staff  25 Dec 12 12:39 r1.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r10.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r11.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r12.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r2.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r3.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r4.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r5.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r6.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r7.gz
-rw-r--r--  1 michael  staff  20 Dec 12 12:39 r8.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 r9.gz
-rw-r--r--  1 michael  staff  19 Dec 12 12:39 stores.gz
% ls -l 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455 
total 1831736
drwxr-xr-x  20 michael  staff        640 Dec 12 12:39 child_0_0
-rw-r--r--@  1 michael  staff   12607488 Dec 12 12:47 exports
-rw-r--r--   1 michael  staff  185103710 Dec 12 12:47 gas.gz
-rw-r--r--   1 michael  staff        202 Dec 12 12:39 input
-rw-r--r--   1 michael  staff  153790837 Dec 12 12:47 loads.gz
-rw-r--r--   1 michael  staff    1577037 Dec 12 12:47 opcode.gz
-rw-r--r--@  1 michael  staff      16919 Dec 12 12:47 output
-rw-r--r--   1 michael  staff   14633420 Dec 12 12:47 pc.gz
-rw-r--r--   1 michael  staff   14062958 Dec 12 12:47 r0.gz
-rw-r--r--   1 michael  staff    2021511 Dec 12 12:47 r1.gz
-rw-r--r--   1 michael  staff   22729021 Dec 12 12:47 r10.gz
-rw-r--r--   1 michael  staff   31460817 Dec 12 12:47 r11.gz
-rw-r--r--   1 michael  staff   54604443 Dec 12 12:47 r12.gz
-rw-r--r--   1 michael  staff   12460865 Dec 12 12:47 r2.gz
-rw-r--r--   1 michael  staff   28310830 Dec 12 12:47 r3.gz
-rw-r--r--   1 michael  staff   13138497 Dec 12 12:47 r4.gz
-rw-r--r--   1 michael  staff   23226642 Dec 12 12:47 r5.gz
-rw-r--r--   1 michael  staff   26300374 Dec 12 12:47 r6.gz
-rw-r--r--   1 michael  staff   63048349 Dec 12 12:47 r7.gz
-rw-r--r--   1 michael  staff   62326091 Dec 12 12:47 r8.gz
-rw-r--r--   1 michael  staff   27653542 Dec 12 12:47 r9.gz
-rw-r--r--   1 michael  staff  148251858 Dec 12 12:47 stores.gz
% ls -l 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455/child_0_0 
total 1800336
-rw-r--r--  1 michael  staff  397352116 Dec 12 12:47 gas.gz
-rw-r--r--  1 michael  staff   68203781 Dec 12 12:47 loads.gz
-rw-r--r--  1 michael  staff    1067762 Dec 12 12:47 opcode.gz
-rw-r--r--  1 michael  staff    8825802 Dec 12 12:47 pc.gz
-rw-r--r--  1 michael  staff    4123089 Dec 12 12:47 r0.gz
-rw-r--r--  1 michael  staff    3676186 Dec 12 12:47 r1.gz
-rw-r--r--  1 michael  staff   13026870 Dec 12 12:47 r10.gz
-rw-r--r--  1 michael  staff   36110247 Dec 12 12:47 r11.gz
-rw-r--r--  1 michael  staff   12357756 Dec 12 12:47 r12.gz
-rw-r--r--  1 michael  staff    3432098 Dec 12 12:47 r2.gz
-rw-r--r--  1 michael  staff    4325065 Dec 12 12:47 r3.gz
-rw-r--r--  1 michael  staff    6889885 Dec 12 12:47 r4.gz
-rw-r--r--  1 michael  staff   29985735 Dec 12 12:47 r5.gz
-rw-r--r--  1 michael  staff   15046350 Dec 12 12:47 r6.gz
-rw-r--r--  1 michael  staff   46008210 Dec 12 12:47 r7.gz
-rw-r--r--  1 michael  staff   24700861 Dec 12 12:47 r8.gz
-rw-r--r--  1 michael  staff  127071977 Dec 12 12:47 r9.gz
-rw-r--r--  1 michael  staff   68947006 Dec 12 12:47 stores.gz
% du -h 0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02 
 76K	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/auth
879M	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455/child_0_0
1.7G	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02/0_39711455
1.8G	0xf1166dc1eb7baff3d1c2450f319358c5c6789fe31313d331d4f035908045ad02
% ls -lt doom.zip 
-rw-r--r--  1 michael  staff  951338148 Dec 12 13:00 doom.zip
```

 ## Accumulate

Accumulation involves orderd executions of multiple parallel single accumulations.  Using 0-based `ordered_accumulation_index`, we have a simple subfolder per single service accumulation for each ordered accumulation as follows:

- `<timeslot>/`
   - `parallel_<ordered_accumulation_index>/`
      - `single_<service_id>/`: PVM trace data, one subfolder
         - `input`: accumulate input (t,s,|o|)
         - `accumulate_inputs`: accumulate inputs (see `fetch` 14, 15)
         - `output` or `err`: accumulate output

Additional streams could be:
* `state_updates` - instead of all key-values, just the keys and values actually updated
* `accumulate_output` - as incorporated into MMR 
* `post_state_root` 

Please suggest others!  

**Example**: [0.7.2/fuzzy/00000151](https://github.com/jam-duna/jamtestnet/tree/main/jam-test-vectors/0.7.2/fuzzy/00000151)

```
% ls -l fuzzy/00000151/*/*
fuzzy/00000151/parallel_0/single_0:
total 400
-rw-r--r--  1 michael  staff    462 Dec 12 13:07 accumulate_input
-rw-r--r--  1 michael  staff  43231 Dec 12 13:07 gas.gz
-rw-r--r--  1 michael  staff      4 Dec 12 13:07 input
-rw-r--r--  1 michael  staff  25600 Dec 12 13:07 loads.gz
-rw-r--r--  1 michael  staff   2846 Dec 12 13:07 opcode.gz
-rw-r--r--  1 michael  staff  14723 Dec 12 13:07 pc.gz
-rw-r--r--  1 michael  staff   2754 Dec 12 13:07 r0.gz
-rw-r--r--  1 michael  staff   2212 Dec 12 13:07 r1.gz
-rw-r--r--  1 michael  staff   5213 Dec 12 13:07 r10.gz
-rw-r--r--  1 michael  staff   3895 Dec 12 13:07 r11.gz
-rw-r--r--  1 michael  staff   2933 Dec 12 13:07 r12.gz
-rw-r--r--  1 michael  staff   1464 Dec 12 13:07 r2.gz
-rw-r--r--  1 michael  staff   1269 Dec 12 13:07 r3.gz
-rw-r--r--  1 michael  staff   1744 Dec 12 13:07 r4.gz
-rw-r--r--  1 michael  staff   4099 Dec 12 13:07 r5.gz
-rw-r--r--  1 michael  staff   4342 Dec 12 13:07 r6.gz
-rw-r--r--  1 michael  staff   7023 Dec 12 13:07 r7.gz
-rw-r--r--  1 michael  staff   7870 Dec 12 13:07 r8.gz
-rw-r--r--  1 michael  staff   5184 Dec 12 13:07 r9.gz
-rw-r--r--  1 michael  staff  20543 Dec 12 13:07 stores.gz

fuzzy/00000151/parallel_0/single_393815649:
total 264
-rw-r--r--  1 michael  staff    399 Dec 12 13:07 accumulate_input
-rw-r--r--  1 michael  staff      1 Dec 12 13:07 err
-rw-r--r--  1 michael  staff  20479 Dec 12 13:07 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 12 13:07 input
-rw-r--r--  1 michael  staff  13747 Dec 12 13:07 loads.gz
-rw-r--r--  1 michael  staff   2490 Dec 12 13:07 opcode.gz
-rw-r--r--  1 michael  staff   9837 Dec 12 13:07 pc.gz
-rw-r--r--  1 michael  staff   1444 Dec 12 13:07 r0.gz
-rw-r--r--  1 michael  staff    935 Dec 12 13:07 r1.gz
-rw-r--r--  1 michael  staff   3234 Dec 12 13:07 r10.gz
-rw-r--r--  1 michael  staff   2593 Dec 12 13:07 r11.gz
-rw-r--r--  1 michael  staff   2492 Dec 12 13:07 r12.gz
-rw-r--r--  1 michael  staff    966 Dec 12 13:07 r2.gz
-rw-r--r--  1 michael  staff    877 Dec 12 13:07 r3.gz
-rw-r--r--  1 michael  staff   1145 Dec 12 13:07 r4.gz
-rw-r--r--  1 michael  staff   2162 Dec 12 13:07 r5.gz
-rw-r--r--  1 michael  staff   2358 Dec 12 13:07 r6.gz
-rw-r--r--  1 michael  staff   3136 Dec 12 13:07 r7.gz
-rw-r--r--  1 michael  staff   4989 Dec 12 13:07 r8.gz
-rw-r--r--  1 michael  staff   2786 Dec 12 13:07 r9.gz
-rw-r--r--  1 michael  staff  11267 Dec 12 13:07 stores.gz

fuzzy/00000151/parallel_0/single_3953987649:
total 240
-rw-r--r--  1 michael  staff    200 Dec 12 13:07 accumulate_input
-rw-r--r--  1 michael  staff      1 Dec 12 13:07 err
-rw-r--r--  1 michael  staff  15820 Dec 12 13:07 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 12 13:07 input
-rw-r--r--  1 michael  staff  10842 Dec 12 13:07 loads.gz
-rw-r--r--  1 michael  staff   2227 Dec 12 13:07 opcode.gz
-rw-r--r--  1 michael  staff   8519 Dec 12 13:07 pc.gz
-rw-r--r--  1 michael  staff   1106 Dec 12 13:07 r0.gz
-rw-r--r--  1 michael  staff    759 Dec 12 13:07 r1.gz
-rw-r--r--  1 michael  staff   2198 Dec 12 13:07 r10.gz
-rw-r--r--  1 michael  staff   1828 Dec 12 13:07 r11.gz
-rw-r--r--  1 michael  staff   1636 Dec 12 13:07 r12.gz
-rw-r--r--  1 michael  staff    642 Dec 12 13:07 r2.gz
-rw-r--r--  1 michael  staff    655 Dec 12 13:07 r3.gz
-rw-r--r--  1 michael  staff    784 Dec 12 13:07 r4.gz
-rw-r--r--  1 michael  staff   1613 Dec 12 13:07 r5.gz
-rw-r--r--  1 michael  staff   1578 Dec 12 13:07 r6.gz
-rw-r--r--  1 michael  staff   2611 Dec 12 13:07 r7.gz
-rw-r--r--  1 michael  staff   3882 Dec 12 13:07 r8.gz
-rw-r--r--  1 michael  staff   2185 Dec 12 13:07 r9.gz
-rw-r--r--  1 michael  staff   8351 Dec 12 13:07 stores.gz

fuzzy/00000151/parallel_1/single_1858391252:
total 208
-rw-r--r--  1 michael  staff    154 Dec 12 13:07 accumulate_input
-rw-r--r--  1 michael  staff  10057 Dec 12 13:07 gas.gz
-rw-r--r--  1 michael  staff      8 Dec 12 13:07 input
-rw-r--r--  1 michael  staff   6819 Dec 12 13:07 loads.gz
-rw-r--r--  1 michael  staff   1584 Dec 12 13:07 opcode.gz
-rw-r--r--  1 michael  staff     32 Dec 12 13:07 output
-rw-r--r--  1 michael  staff   6633 Dec 12 13:07 pc.gz
-rw-r--r--  1 michael  staff    649 Dec 12 13:07 r0.gz
-rw-r--r--  1 michael  staff    424 Dec 12 13:07 r1.gz
-rw-r--r--  1 michael  staff   1355 Dec 12 13:07 r10.gz
-rw-r--r--  1 michael  staff   1118 Dec 12 13:07 r11.gz
-rw-r--r--  1 michael  staff   1578 Dec 12 13:07 r12.gz
-rw-r--r--  1 michael  staff    328 Dec 12 13:07 r2.gz
-rw-r--r--  1 michael  staff    337 Dec 12 13:07 r3.gz
-rw-r--r--  1 michael  staff    430 Dec 12 13:07 r4.gz
-rw-r--r--  1 michael  staff   1188 Dec 12 13:07 r5.gz
-rw-r--r--  1 michael  staff   1982 Dec 12 13:07 r6.gz
-rw-r--r--  1 michael  staff   1906 Dec 12 13:07 r7.gz
-rw-r--r--  1 michael  staff   2707 Dec 12 13:07 r8.gz
-rw-r--r--  1 michael  staff   1901 Dec 12 13:07 r9.gz
-rw-r--r--  1 michael  staff   5133 Dec 12 13:07 stores.gz
```
