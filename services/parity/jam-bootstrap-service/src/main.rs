//! JAM Bootstrap Service
//!
//! Use by concatenating one or more encoded `Instruction`s into a work item's payload.

#![cfg_attr(any(target_arch = "riscv32", target_arch = "riscv64"), no_std)]
#![cfg_attr(any(target_arch = "riscv32", target_arch = "riscv64"), no_main)]
#![allow(clippy::unwrap_used)]

extern crate alloc;

use alloc::string::ToString;
use jam_bootstrap_service_common::Instruction;
use jam_pvm_common::{
	accumulate::*,
	refine::{export_slice, import},
	*,
};
use jam_types::*;

#[cfg(not(any(target_arch = "riscv32", target_arch = "riscv64")))]
fn main() {}

#[allow(dead_code)]
struct Service;
jam_pvm_common::declare_service!(Service);

impl jam_pvm_common::Service for Service {
	fn refine(
		id: ServiceId,
		payload: WorkPayload,
		_package_info: PackageInfo,
		_extrinsics: Vec<Vec<u8>>,
	) -> WorkOutput {
		info!(target = "boot", "Executing refine for service #{id}");

		//let test_hash = [1u8; 32];
		//let mut target = vec![0; 100];
		//let preimage = lookup(test_hash);
		//assert_eq!(&preimage.unwrap(), &[1, 2, 3]);
		let mut cursor = &payload[..];
		let mut out = vec![];
		while !cursor.is_empty() {
			match Instruction::decode(&mut cursor).unwrap() {
				Instruction::Lookup { service, hash } => {
					info!("Looking up...");
					let maybe_data = lookup(service, &hash);
					info!("Got {:?}", maybe_data);
					out.push(maybe_data.map_or(Instruction::Lookup { service, hash }, |data| {
						Instruction::LookedUp { data }
					}));
				},
				Instruction::RandomStorageRefine(input) =>
					out.push(Instruction::RandomStorageAccumulate(
						jam_bootstrap_service_common::test_key_vals::generate_payload(input),
					)),
				Instruction::Export { data } => {
					for d in &data {
						let r = export_slice(d);
						info!("Exported slice: {d:?} -> {r:?}");
					}
					out.push(Instruction::Exported { count: data.len() as u32 })
				},
				Instruction::Import { items } => {
					let data = items
						.into_iter()
						.map(|(index, len)| import(index).unwrap().truncate_into_vec(len as usize))
						.collect();
					out.push(Instruction::Imported { data });
				},
				x => out.push(x),
			};
		}
		out.encode().into()
	}
	fn accumulate(context: OnChainContext, results: Vec<AccumulateItem>) {
		info!(target = "boot", "slot ${}; balance = {}", context.slot, my_info().balance,);
		for raw_instructions in results.into_iter().filter_map(|x| x.result.ok()) {
			for inst in Vec::<Instruction>::decode(&mut &raw_instructions[..]).unwrap() {
				info!("Decoded instruction: {:?}", inst);
				match inst {
					Instruction::CreateService {
						code_hash,
						code_len,
						min_item_gas,
						min_memo_gas,
						endowment,
						memo,
					} => {
						let id = create_service(&code_hash, code_len, min_item_gas, min_memo_gas);
						if let Ok(id) = id {
							info!("Created service #{:x}", id);
							id.using_encoded(|d| set_storage(b"created", d).expect("balance?"));
							let _ = transfer(id, endowment, min_memo_gas, &memo);
						} else {
							error!("Failed to create!");
						}
					},
					Instruction::Upgrade { code_hash, min_item_gas, min_memo_gas } =>
						match upgrade(&code_hash, min_item_gas, min_memo_gas) {
							Ok(_) => info!("Upgraded!"),
							Err(_) => error!("Failed to upgrade!"),
						},
					Instruction::Transfer { destination, amount, gas_limit, memo } => {
						info!("Gas remaining: {}", gas());
						info!(
							"Attempting transfer: {} {} {} {:?}",
							destination, amount, gas_limit, memo
						);
						let e = transfer(destination, amount, gas_limit, &memo);
						info!("Result: {:?}", e);
						(destination, amount, memo)
							.using_encoded(|d| set_storage(b"transferred", d).expect("balance?"));
					},
					Instruction::LookedUp { data } => {
						set_storage(b"looked_up", &data[..]).expect("balance?");
					},
					Instruction::Imported { data } => {
						info!("Imported data {:?}", data.iter().cloned().map(AnyVec));
						set_storage(b"imported", &data.encode()).expect("balance?");
					},
					Instruction::Exported { count } => {
						info!("Exported {count} items");
						set_storage(b"exported", &count.encode()).expect("balance?");
					},
					Instruction::Solicit { hash, len } => {
						solicit(&hash.0, len as usize).unwrap();
						set_storage(b"requested", &hash[..]).expect("balance?");
					},
					Instruction::Forget { hash, len } => {
						forget(&hash.0, len as usize).unwrap();
						set_storage(b"unrequested", &hash[..]).expect("balance?");
					},
					Instruction::Assign { core, queue } => {
						info!("Assigning core {:?} to queue {:?}", core, queue);
						match assign(core, &queue) {
							Ok(_) => info!("Assigned!"),
							Err(_) => error!("Failed to assign!"),
						}
					},
					Instruction::Bless { manager: b, assign: a, designate: d, auto_acc } => {
						info!(
							"Blessing services m: #{}, a: #{}. v: #{}. aa: {:?}",
							b, a, d, auto_acc
						);
						match bless(b, a, d, auto_acc) {
							Ok(_) => info!("Blessed!"),
							Err(_) => error!("Failed to bless!"),
						}
					},
					Instruction::Designate { keys } => {
						info!("Designating keys {:?}", keys);
						match designate(&keys) {
							Ok(_) => info!("Designated!"),
							Err(_) => error!("Failed to designate!"),
						}
					},
					Instruction::RandomStorageAccumulate(result_refine) => {
						if let Ok(keys) = result_refine {
							let mut count: u64 = get_storage(b"count_random_storage")
								.map(|v| u64::decode(&mut v.as_slice()).unwrap())
								.unwrap_or(0);
							// Warning this instruction is for testing. Most of the work is done in
							// accumulate which is bad design.
							for item in keys.items.into_iter() {
								set_storage(&item.key[..], &item.key[..]).expect("balance?");
								count += 1;
							}
							set_storage(b"count_random_storage", &count.encode()[..])
								.expect("balance?");
						}
					},
					i => {
						info!("Instruction not handled: {:?}", i);
					},
				}
			}
		}
	}

	fn on_transfer(_context: OnChainContext, items: Vec<TransferRecord>) {
		for TransferRecord { source, amount, memo, .. } in items.into_iter() {
			let count = get::<u32>(b"transfer-count").unwrap_or(0);
			set(b"transfer-count", count + 1).expect("balance?");
			info!(
				target = "boot",
				"Received transfer from {source} of {amount} with memo {}",
				alloc::string::String::from_utf8(memo.as_ref().to_vec())
					.unwrap_or("???".to_string())
			);
			set_storage(
				alloc::format!("transfer{count}").as_bytes(),
				&(source, amount, memo).encode()[..],
			)
			.expect("balance?");
		}
	}
}
