#![allow(non_snake_case)]
#[cfg(test)]
mod tests {
    use reed_solomon_simd::{ReedSolomonEncoder, ReedSolomonDecoder};
    use std::error::Error;
    use hex;
    use serde_json::json;
    use std::fs;
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    use serde_json::Value;

    fn encode(d_hex: &str, V: usize, C: usize) -> Result<(), Box<dyn Error>> {
        let W_E = C * 2;
        let mut d_bytes = hex::decode(d_hex.trim_start_matches("0x"))?;
        let d_bytes_len = d_bytes.len();
        if d_bytes_len % W_E != 0 {
            let pad_len = W_E - (d_bytes.len() % W_E);
            d_bytes.extend(std::iter::repeat(0).take(pad_len));
        }

        let k = d_bytes.len() / W_E;

        let mut original_shards = vec![Vec::with_capacity(W_E); C];
        for i in 0..k {
            for c in 0..C {
                original_shards[c].push(d_bytes[i * W_E + c * 2]);
                original_shards[c].push(d_bytes[i * W_E + c * 2 + 1]);
            }
        }

        let mut encoder = ReedSolomonEncoder::new(C, C * 2, 2 * k)?;
        let mut shards_json = Vec::new();
        for shard in &original_shards {
            encoder.add_original_shard(shard)?;
            let actual_hex = format!("0x{}", hex::encode(shard));
            shards_json.push(actual_hex);
        }

        let result = encoder.encode()?;
        let recovery: Vec<_> = result.recovery_iter().collect();
        if recovery.len() != C * 2 {
            panic!("Expected {} recovery shards, got {}", C*2, recovery.len());
        }

        for r in &recovery {
            let actual_hex = format!("0x{}", hex::encode(r));
            shards_json.push(actual_hex);
        }

        let bs = if d_bytes_len == 4104 { "segment" } else { "bundle" };
        let sz = if V == 6 { "_tiny" } else { "_full" };
        let fn_ = format!("test_{}_{}{}.json", bs, d_bytes_len, sz);
        let json_out = json!({
            "segment": d_hex,
            "shards": shards_json
        });

        fs::write(&fn_, serde_json::to_string_pretty(&json_out)?)?;
        println!("✅ encode SUCCESS {} bytes into {} shards ({} original, {} recovery) → {}", d_bytes_len, V, C, V - C, fn_);
        Ok(())
    }

    fn decode(fn_: &str, d_hex: &str, V: usize, C: usize) -> Result<(), Box<dyn Error>> {
        let  orig_bytes = hex::decode(d_hex.trim_start_matches("0x"))?;
        let orig_bytes_len = orig_bytes.len();
        let mut d_bytes = hex::decode(d_hex.trim_start_matches("0x"))?;
        let file_contents = fs::read_to_string(fn_)?;
        let json_data: Value = serde_json::from_str(&file_contents)?;
        let W_E = C * 2;
        if orig_bytes_len % W_E != 0 {
            let pad_len = W_E - (orig_bytes_len % W_E);
            d_bytes.extend(std::iter::repeat(0).take(pad_len));
        }

        let k = d_bytes.len() / W_E;
        //println!("k={} Decoding {} bytes from {} shards ({} original, {} recovery)", k, d_bytes.len(), V, C, V - C);
        let shards_json = json_data["shards"]
            .as_array()
            .ok_or("Missing or invalid 'shards' array")?;

        let mut all_shards: Vec<Vec<u8>> = Vec::new();
        for s in shards_json {
            let s_hex = s.as_str().ok_or("Invalid shard string")?;
            let bytes = hex::decode(s_hex.trim_start_matches("0x"))?;
            all_shards.push(bytes.clone());
            //println!("Shard : {} bytes = 0x{}",  bytes.len(), hex::encode(&bytes));
        }
        const NUM_TRIALS: usize = 10;
        for trial in 0..NUM_TRIALS {
            let mut recovered_shards = vec![vec![0u8; k * 2]; C];
            let mut present_indices: Vec<usize> = (0..V).collect();
            present_indices.shuffle(&mut thread_rng());
            present_indices.truncate(C);

            let mut decoder = ReedSolomonDecoder::new(C, 2 * C, k*2)?;

            for &i in &present_indices {
                if i < C {
                    decoder.add_original_shard(i, &all_shards[i])?;
                    recovered_shards[i].copy_from_slice(&all_shards[i]);
                } else {
                    decoder.add_recovery_shard(i - C, &all_shards[i])?;
                }
            }

            let result = decoder.decode();
            match result {
                Ok(decoded) => {
                    for (index, segment) in decoded.restored_original_iter() {
                        recovered_shards[index].copy_from_slice(segment);
                    }
                    // show C recovered_shards
                    //for i in 0..C {
                    //    println!("{} recovered_shards[{}] = 0x{}", trial, i, hex::encode(&recovered_shards[i]));
                    //}
                    let mut reconstructed: Vec<u8> = Vec::with_capacity(k * W_E);
                    for i in 0..k {
                        for c in 0..C {
                            reconstructed.push(recovered_shards[c][2 * i]);     // low byte
                            reconstructed.push(recovered_shards[c][2 * i + 1]); // high byte
                        }
                    }
                    // Clip to the expected length
                    let trimmed = &reconstructed[..orig_bytes_len];
                    if trimmed != orig_bytes {
                         return Err(format!("Trial {} failed: reconstructed segment does not match expected", trial).into());
                    } else {
                       //  println!("{} reconstructed {} bytes", trial, orig_bytes_len);
                    } 
                }
                Err(e) => {
                    println!("Decoding failed: {:?}", e);
                }
            }
        }

        println!("✅ decode SUCCESS for {} over {} trials", fn_, NUM_TRIALS);
        Ok(())
    }

    #[test]
    fn test_encode_decode() -> Result<(), Box<dyn Error>> {
        let b10 = "0x1421199addac7c87873a";
        let b272 = "0x0000000000fa002583136a79daec5ca5e802d27732517c3f7dc4970dc2d68abcaad891e99d001fd1664d60a77f32449f2ed9898f3eb0fef21ba0537b014276f7ff7042355c3a8f001f0b92def425b5cbd7c14118f67d99654e26894a76187f453631503f120cfee77aea940e38601cb828d2878308e32529f8382cf85f7a29b75f1c826985bc1db7f36f81fc164ee563dc27b8e940a40f8c4bc334fe5964678b1ed8cc848f6111451f0000010000000028a0e0c33fcc7cadbb6627bcc902064e89ba1d16c26ea88371a4f614942fb8372906e90be226abaccc638a0addae983f814190ba97367f8abc5e21642a1e48f23d57724100000000000000105e5f000000008096980000000000000000000000";
        let s4104 = "0xeb390c02e701e9c3584bfc5ce48c64fc804526778fe6fc3e51850fcd9db19512d5395a6402a72fac3c169ff9bae6826eedc2c94dc99ab7ec60e5fb8000030fd54cfe3d9c29efc766aad3d3781ecc9c7ed0616c799fb2eccee0ee1897c971a386f51dd3c70e0ebcc30511112c7d6a008a6463c8a1bb7ee86e683787cbfac83a4516cb4417e3e02104e1e5a2e81c252b95ee5125f0f1a7cafc315013526c1e01dd1f8493dfac8364bb60d984d76e59a0c2227b128050722535e9fda3ff313e447cfe1132245848b436f7863e6520e9c7909d5f1d2bac4918ec2667931ad29552eccca417f9eb2882d42c695374d27216eb40f32965671e528843a064cd2ff1c5520725cf2e57076b9117fafc8ba832c7f887368e03b6506bcf1caa99b39baab9315419e1025c74f444548815896a5f76055f8757d9ca964609e50e8de160bedc67aa69d7895c8b8daf8c9f9657851ef07f02d2fea5bd8c94fb74e0c4115c60829d018a8b445b3f0d12622bea132655ff59b7bd652e26bac52f1f4fcc2dd6507c75b3c51de0bd7d0f7d413fe770a1fab20448554ad94625dd2d60d53dcbc684fd557a1f7fe19bf0cd5d0f199df4037e4bdbc86317ed9848fb6b3d9c8103c0cc9e01b46b7e6c02f539ede5139317f6d4d376df0e7ed6df983ce88e6c4270ec71533e880d8be0b64e4344e82a45e9a6b6175fc83ec47fd3b2d3d71e626470ffe08b6acf6c2f6abef83151f50213264f50631003ad98cd56bc947f829c3389816f065664afa37710bb42492f74336fb3e632f7f5c5382d5994b154814a2572c55896da57be0ab4a769a5c45f3ad1f3d6c67da2afa3ccbbc4ba9747dd2c8131ee15033b4b2100833e4e40429edcf0ef1448bf4be435abded1defe82dbab76332702e60bbdd6de8513acd6c0bc9c6d091af77bc977e67c7cd5324a4e6b1b050b6ab2f90ea9e41f29703ea98d990e9189d8341c338f0a2cf4895e480d94e7d329b0fbddb76fc5d1e09108d76be101445de68d3161492c97742ab1af9386f3fc76f6893e087f83584f17d3785ac1ee83966421b3170289e459a19051cedd05c69e7acae2547c94a6df5efe316dd4aed33db08d3ebff01276efdf40d1f82f352c3f22eca91c934898271cb0a5fb4d3833952ab67c711e1e1bbdae8b0e2d72392ebbe656ba795c2d56289b02e5b28bc822a53a6665d85ebb077112e9129bb9a211e831bf0ba503a97eed21a2325894f943c303e0ea61b0b90f5d4b5f5cee1702cb39d5620899978233432169c961504d89a9f9c37b24ff204dcaba0795714b54581382c95d8c726cb1d65299aaf691381cb7ab7c5ca6fc44a8ce04ef71748ab8cfa608a81abe1ae1a60bcf8b6a14e7fa7721cf7ccc561334bd523c4d1a232baaf9e1481ad549adab6dd24ccd469725d1829bb7871a4b14b86bdbc600fa16a44d8771b79ad0e40b3e8a268985d1d41284cbe3fbc42483e49338bdb4e0d2a60802830ce9d2500be91106f176a9aa678148e01d719acb2995e71839bfff4bf8b9aaf59a1f52ab340769c4e44a59af881c83252392f4023193f916cfc2a851ac88e44b9255dcc2ba530c7e83606c15fc774f0bf52e6c69cbda09566b81a9f446e551036a6263cf1c912670645acc9fd16ac7473bd05f275137accc06a50d71444f0712d92c24f27d4bc7421b06313def28f4accf2fe32f2f8dc0ccf8e044b8e03e09efffdba58faee83757963f31fb35cd239a3b07a63b5000b2b195bf2d6808273b3ba7fb0fbb209f60fc37cce70414a86b9611a594bc2316ed5d23c857fc340832009e70430b654eead53da3280ef94d82587391b6751ab77879420aa664dd948e77a5311db7d619797eb8e0420da67a7c625c568fa242b0a19c48bdb1324ff005f52ea77ccdd18b043f008e4991a0cebdbac9a779dc6fe4b9c13dade3fe8aad85c889b1fa63297afebdeb8bfbff5c9cabd9bb361f5317e1db7a2dfc40b12376cd301b40d5778ab6b11b761e2ff5ba473f23bd8115bc9df7ecb80e24d2bcaf4bfe2153ec93af2e2354db0df0bd7268fd35310a7fc6bbe8f72cff9f02a362504f702d21580566fcc1737d85bb8dac4f3a6ca2a6245b324a2a821d4e5a8ec582dee7e963642ab5a7e0f0ed82f3f04eff76b76b00ce4a5203f95e48aac5f8aa5ad95af57fba4280c46c73aaffee2f0708b5e00a4912ee347fd19dd52dd167d15d2d4c10cb08dd70c40df0d9380e5f57c3a0f93a705559e530e813079ba3ab66fec0f0d09947fb6ecc50e9c93eaa3b97fd015d143777875312be9ddb4d4d5e73b9e8a2ac0bc20279e71a4cb8f23e84c42c4ba0ea42735ba2c71374d31b57d702cd49af224114d78b72156816f1335a23094bd3d9cddb9bad14759f621e68610dc71138f32cead2afb223f902acb871160c0038e4c7a807c280884ea16125e4c9215a6b03564e62cdb278fe39054eb782cfe1c5e6ca039b840924e38800b9da5dd998ac57834157ed565bc06d1330977341d93ac2c3ad614677a9c83f22d67e921395e037413f44424877a4debc38cb7bc12e80c34089d32385cc4dd6694ee6db3b1ac64ba7416e189b517964b9c81689d86c63c855aa46e93e2cf9c9cb87e78c46dcc26dbfcc15b91595b88629ce090248f237ec5f170f88cc743edf576f7304d2a94e884cd38571ca05b7bec23632310f6476215a18096a93d7c5005c06ff573778cbe86b269096d0f120b03e05bbe391431621d91806abda5510cb3f0aa3ed22dcaad80f9714b6d0a580f695b69ca276b35ce68afe7069a8dd1df2108c154e6f351c2c13e4c770b6e33c3a893e5d3a055e4ee25dc0b14f39958a58515c22b9d21f421be1c0274af21a8bc14d6d4c75cdd92f5f0ae654c8108719ebbf4176921cb81a1b29a20f2fb8e07baf627afaf02617f971ade3d2732160d0caa75458c296419428846649a43ce63a0982a73d8632cb85457657e7323596d7d9f67b6cc0d9f367b77e88d68b97e7019342437b0ffde8a2bc51fbd3aeb9223eb5647377f6e70c5a5aba5833396aca89125dcdcf59d5e49ab050da56b30440a2df1c4bb90cae08162906b6139e7c63e2eb2b6dfc39d5890e09360df9bc0dffe7541d878d01a481926ebff2b8a0fdb4a75aba0f4d02409b680d0aed67f59ece8e5961eb5a180f7c04158dc2e66c5b5ebc147150cefcea3371b2ba3c9013f8d44e7f168ab98d30ca3666659d9ea5b1b04a85403ea8c0ea53064d1fb3d352e203d3f7d85d6c8cc3d7397e396ac5e63dcce71fbf5e420d132bb0819c3214f847c4b6409f6afe0b5e77710f652ffb4dea8ce486cfff41783ebf5da9f364ff36f01bcc678e446c636d1049d2f4fe1cfee0556dc9fb44741374204e86f16f3d4f8aab66291732d01e3384abec84ff221f03ae17f821c392766b2ba6b3d26ff42bc5283432be535836991877a54be5d76c7621ea5ceb57bd7e0662515f2adfd97f5c7bd88e94307597925b9c2d45e745a72e469c70de62bfe8bfcbd5d07dee52bc02a491234a77b5c46e180fef00bda23cc04a8ede15af37d886f622ca50ba2a01372da59ca0631d03422facbb1f5080a9d3eb3ac6a751c5b19299c4e90343e7d81e96682fff3c780023f7b71a870ed26be23be4e906bc10df96ded9452e1e6e584cc83a407b09550a645e0b1a144e30da47445cb27a11272e4ea73a2b745842a504b6cbd0b63f605058d7f867d9c6033eabcc22698348e9e4bc37ec65d1812ce6170d8191961e3cdee4e44dcb50f763afaaf16cb19043beb00295556862d95eb850dd13791a32cacfa51f9811082b3d203bf6d8d118cfdc907c5e2929fce61b6c9ea3575dbe3a1fbb95a6fbe49ea66f879e5b511ad0ca2c044ef994e808840448cbb4e9265e5b190995c39222e586b89556770a8b35993fb5ce0034cd3f158bafc52b85fe509af868a407c3fba10c806c7a6d8fbae34b28e96f693e326821fd5918c6e87ca6d8909f22261d218b60fa5336a5efb2c6fff446a7a48c8167d91718605960582c75bef2e4b403bc7b15166caa9a0be3e0a677da2f1c9c597259c5fbb703e63f2ba518f8e36201378be8d4e47229a25dc8f7d8f3e9fed447728d25cf92e43492ae0aa1d6b98ebf6a9991e0286e871275325b96f9ab1820a589adcaa43f9ede8982515246ebd60fb7b84da1740bd170a0062b21c5df08743dcb57bd922e09c367f07844308d12b519dfecf44b17f49c5fabcb788599325152cf848d882515806a4d5f779c9332994652b29b3424f974f5e0eab60d3db12055553f73595a3cddd44fafa7ce9f6a687d109f216a4b9f12c69aaf28c7c71dabf4c41f95946e96d0f0e1a15e88814608b7df0a84a456b77de41a0aabc7176a20ab28f613d546acb91985ff12a2e9f91dfd90d4f99bc1a2a9c0035b48c567f3aba539988005309ad00ecba017d20d1375e04eb85c638e5c8607587a7c2e691c0b5c1142d334db754def52a1dff72347fc3dd34fbf8fb1da5fd8c74baa384d97900b6c03d399f2bb731ca882785218c6fe7ea52840416edee611463f90567cc35c26e27bac7b07fdbaf153014bbc0c994fc96624869cfa40f95a96dbfda343a9279fbf83beb2e898b36e37a6e850a46a49c79779756caddb12497d9b16021bc38d671e24eb252c5413756ab0fafc5830d40ab036dac341541a24b538eed6fff78dd071d2c53878e9f125ad8b35d7a95ea889acda13c7bb608d3fbceccbd615f456056e930ef73f41b76c6479dc9dbc0bd633eedc4d1c48e883fa96cf16fe1277aea7f19fe91c0dc3d26e169a1c1fbe03fb147653935dfc9b81eaf4989162ca77478537609f131224bcf460b149952f679c02fb4e2c54ead4da33caf9e927e094b547ff387e417bb7a1222fd1a6e2e33c615939415db428136ba81261c33925070bc88f4f15a2c1b6bd762f6b368fd08ea4eb1ee177a67dadfee60718a2a7b02c2701d65fc15db2583ac7eb00c3c3a84378a2a1439d35a11461b99c85f065ba6f2a4f5dcf566d6f453290a3020463318882435d3de0ef5f9f965d72232035f19085e7fa005bc6fa549e93dfbfcb0f3bf79b30c45e894732c5cffc19ab98dc2adf1d28e2b4e8fca307dca99104ff74e9cc1b002d063ee10758491212df24ad0e14bed434dcd6f003937026a6f9d81d531e54a10ef2fb3f08de3a0a9a0cd2fb8bc65f6cb7e453e4a1143bf1e97ae4970125a4fa90431bfd85ec71a46f79e765428440e59248bf6e093020fe8254dce862817e613d49b573674e34c3825e614e404650cc2b747280255665d6be8a11c59e07294cf72c90afab9c0e31fff87aa01efaae426b1c7a06e5c133f2baba8d382f97c4bfec2cfd12a4fa5f888ec8d099b0741b86d80a8036eac8a68959f7c04a28297cf2052b268946216df5ace51464cc7902d1740a070f18319a0d6a3aeba2f496e47d832219e71256640216336c7f7f31cf1fc3560e391b62fa9a2d76c03484a635e00689b9ce2cb4fb8c0e5e08d68f3ca909221f89e211267c013f28e04503bd548b0cf213f428084381f9ec4c2d96e3bb8e8cf4a97f829d4dd63564ded50398cd2efb1de7ccfdc06a1e728fb83eec5fcbaf54924fc41f025f615af4b0b3e686bd811fa90364f042a68ca094327838edc84c1612460cc485d88eae02193ab3e332167c87196d27f744244939281b8841a168dc06b2b47d44f7eab1c38b0fd67d6b5dcf2aa82f1fe861894c080749b36f196713d6a982ea469e8eeae90b685674b25c477dde47cf0d3b7061519641e71f5a09ef94fe1700375888109ce237923023cf942daf52724d0dad1a781024b2";

        encode(b10, 1023, 342)?;
        encode(b10, 6, 2)?;
        encode(b272, 6, 2)?;
        encode(s4104, 6, 2)?;
        encode(b272, 1023, 342)?;
        encode(s4104, 1023, 342)?;

        decode("test_bundle_10_tiny.json", b10, 6, 2)?;
        decode("test_bundle_272_tiny.json", b272, 6, 2)?;
        decode("test_segment_4104_tiny.json", s4104, 6, 2)?;
        decode("test_bundle_10_full.json", b10, 1023, 342)?;
        decode("test_bundle_272_full.json", b272, 1023, 342)?;
        decode("test_segment_4104_full.json", s4104, 1023, 342)?;
        Ok(())
    }
}



