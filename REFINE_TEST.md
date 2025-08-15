# WorkReport Test Procedure

## Objective
The purpose of this test is to verify that a given node can execute a recorded **Work Package Bundle** starting from a known state and produce a **WorkReport** that matches the expected result.

## Test Flow
1. **Initialize the node with a known state**  
   Load the node’s state from the snapshot of a specific `StateTransition` to ensure a deterministic starting point.

2. **Load the Work Package Bundle Snapshot**  
   Use the recorded **BundleSnapshot** data, which contains:
   - The `package_hash` and `core_index`
   - The full `bundle` (work package, extrinsics, justifications, imports)
   - `segment_root_lookup`
   - The expected `slot`
   - The reference **WorkReport** to compare against

3. **Execute the Work Package Bundle**  
   Run the bundle through the node with the same execution environment (including the same PVM backend) as in the original run.  This step should produce a newly generated **WorkReport**

4. **Validate the Execution**  
   - Compare the generated **WorkReport** with the recorded reference report

## BundleSnapshot Contents
A BundleSnapshot should contain everything needed to re-run the package:
- **Work package details**: authorization, authorizer, context, items list (with service IDs, code hashes, payloads, gas limits, imports/exports)
- **Execution context**: anchors, state roots, beefy roots, lookup anchors
- **Segment root lookup**
- **Slot number**
- **Reference WorkReport**: package spec, context, authorizer hash, results, gas usage, and other metadata

**Example:**
```json
{
  "package_hash": "...",
  "core_index": 0,
  "bundle": { ... },
  "segment_root_lookup": [],
  "slot": 3258991,
  "report": { ... }
}
```


## 💡 Feedback & Contributions
If you encounter any issues, inconsistencies, or have suggestions for improvements, please feel free to open an issue in the repository. Your feedback helps us improve the testing process and ensure consistent results.
