

# Services

JAM Services consist of PVM Byte code placed on-chain with 4 entry points.  
To support the testing of these JAM Services, JAM Implementation teams are encouraged to place
JAM Service code, in any language here.  

* Raw assembly, with [polkatool](https://github.com/koute/polkavm/tree/master/tools/polkatool)
* Rust, see [polkatool](https://github.com/koute/polkavm/tree/master/tools/polkatool)
* C/C++, see [JAMBrains](https://github.com/JamBrains/polkavm-examples)
* Solidity, see [revive](https://github.com/paritytech/revive)

Having a battery of services and workpackages testing a wide variety of _simple_ JAM Services will be invaluable for testing JAM implementations of PVM and support experimentation with the JAM refine-accumulate workflow.


Each JAM Service should have raw source code, build instructions, and a _JAM-ready_ polkavm code blob with 4 entry points:

* `is_authorized` (entry point 0) 
* `refine` (entry point 5) 
* `accumulate` (entry point 10) 
* `on_transfer` (entry point 15) 

Furthermore, as privileged services themselves are needed to place
code blobs on-chain and create JAM Services utilizing these code
blobs, it is critical that teams have a "generic" privileged service
to have a JAM Testnet in "assurances" mode.  This is an open question.

## Raw PVM Assembly code

Teams can develop PVM byte code from assembly following this method to
generate code by hand as described [here](https://github.com/w3f/jamtestvectors/pull/3#issuecomment-2257688558):

```
$ git clone https://github.com/koute/polkavm.git
$ cd polkavm
$ cargo run -p polkatool -- assemble tools/spectool/spec/src/inst_branch_greater_or_equal_signed_ok.txt -o output.polkavm
$ cargo run -p polkatool disassemble --show-raw-bytes output.polkavm
```

This will output the program in a PolkaVM-specific container (which is
not part of the GP), but you can extract the code blob with a simple
Rust program - use polkavm_common::program::ProgramParts::from_bytes
to load the blob and then the code_and_jump_table field will have the
raw program bytes.  This is explored further below.


## Rust using polkatool


Following the advice [here](https://forum.polkadot.network/t/contracts-on-assethub-roadmap/9513/26), the process is documented in [PR #176 - add polkatool jam-service support](https://github.com/koute/polkavm/pull/176):

### 1. Setup toolchain

Install this [rustc-rv32e-toolchain](https://github.com/paritytech/rustc-rv32e-toolchain/) -- we found the release build sufficient.

After installation you should have `~/.rustup/toolchains/rve-nightly/`.  Then

```
export RUSTUP_TOOLCHAIN=rve-nightly
```

will make this tool chain accessible.

### 2. Compile JAM Service

```
cargo build --release --target-dir=./target
```

This will generate a 1MB "elf" directory in your `target` directory matching the above tool, e.g

```
# ls -l target/riscv32ema-unknown-none-elf/release/fib
-rwxr-xr-x 2 root root 1067744 Sep 26 09:37 target/riscv32ema-unknown-none-elf/release/fib
```

### 3. Generate PVM Byte code with `polkatool`

You can then use `polkatool` to generate "JAM-ready" PVM byte code and raw code blobs with:
```
# cargo run -p polkatool jam-service fib/target/riscv32ema-unknown-none-elf/release/jam-service-fib -o fib/jam_service.pvm -d fib/blob.pvm
warning: /root/go/src/github.com/colorfulnotion/polkavm/Cargo.toml: unused manifest key: workspace.lints.rust.unexpected_cfgs.check-cfg
    Finished dev [unoptimized + debuginfo] target(s) in 0.08s
     Running `target/debug/polkatool jam-service guest-programs/jam-service-fib/target/riscv32ema-unknown-none-elf/release/jam-service-fib -o guest-programs/jam-service-fib/jam_service.pvm -d guest-programs/jam-service-fib/blob.pvm`
Writing JAM-ready code blob "guest-programs/jam-service-fib/jam_service.pvm"
Writing raw code "guest-programs/jam-service-fib/blob.pvm"
```

The precise mechanism to have a JAM-ready code blob (as defined in GP)
is under construction but you can see this in progress
[here](https://github.com/koute/polkavm/pull/176)

### 4. Disassemble

Given the above `blob.pvm`, you can disassemble it with `polkatool`:

```
# cargo run -p polkatool disassemble fib/blob.pvm  --show-raw-bytes
// RO data = 0/0 bytes
// RW data = 0/4128 bytes
// Stack size = 4096 bytes

// Instructions = 418
// Code size = 1185 bytes

      :                          @0
     0: 05 ee 01 00 00           jump @52  // is_authorized
      :                          @1
     5: 05 ed 01 00 00           jump @53  // refine
      :                          @2
    10: 05 af 03 00 00           jump @78  // accumulate
      :                          @3
    15: 05 d2 03                 jump @79  // on_transfer
      :                          @4


      :                          @52 [export #0: 'is_authorized']
   494: 04 07                    a0 = 0x0
   496: 13 00                    ret

...
```

## C/C++

See [JAMBrains/polkavm-examples](https://github.com/JamBrains/polkavm-examples) for detailed instructions on how to build a JAM Service in C/C++, including host function calls.  This is a WIP.

## Solidity

[revive](https://github.com/paritytech/revive) is being developed to compile PVM code for Polkadot Asset Hub and may have JAM on the roadmap soon.



