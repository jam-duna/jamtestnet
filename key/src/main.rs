use key_lib::generate_keys_from_seed;
use std::env;
use std::process;

/// Convert a 0x-prefixed hex string to a 32-byte array
fn hex_to_seed(hex_str: &str) -> Result<[u8; 32], &'static str> {
    let hex_str = hex_str
        .strip_prefix("0x")
        .ok_or("Seed must start with '0x'")?;
    let decoded_hex = hex::decode(hex_str).map_err(|_| "Invalid hex string")?;
    if decoded_hex.len() != 32 {
        return Err("Seed must be 32 bytes (64 hex chars)");
    }
    let mut seed = [0u8; 32];
    seed.copy_from_slice(&decoded_hex);
    Ok(seed)
}

fn main() {
    // Get the first argument as the seed input
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: key <0x-prefixed 32-byte seed>");
        process::exit(1);
    }

    let seed_str = &args[1];

    // Convert the seed string to a 32-byte array
    let seed = match hex_to_seed(seed_str) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("Error: {}", e);
            process::exit(1);
        }
    };

    // Generate the keys and output them as a JSON string
    let json_output = generate_keys_from_seed(seed);

    println!("{}", json_output);
}
