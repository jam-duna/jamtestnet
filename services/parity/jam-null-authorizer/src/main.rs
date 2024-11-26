#![cfg_attr(any(target_arch = "riscv32", target_arch = "riscv64"), no_std)]
#![cfg_attr(any(target_arch = "riscv32", target_arch = "riscv64"), no_main)]

extern crate alloc;
use jam_pvm_common::*;
use jam_types::*;

#[cfg(not(any(target_arch = "riscv32", target_arch = "riscv64")))]
fn main() {}

#[allow(dead_code)]
struct Authorizer;
jam_pvm_common::declare_authorizer!(Authorizer);

impl jam_pvm_common::Authorizer for Authorizer {
	fn is_authorized(
		_param: &AuthParam,
		_package: &WorkPackage,
		core_index: CoreIndex,
	) -> AuthOutput {
		info!("This is the null authorizer on core @{core_index} with {} gas", gas());
		Default::default()
	}
}
