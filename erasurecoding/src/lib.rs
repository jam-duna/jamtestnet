#![allow(non_snake_case)]

#[cfg(test)]
mod tests {
    use hex;
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    use reed_solomon_simd::{ReedSolomonDecoder, ReedSolomonEncoder};
    use serde_json::json;
    use std::error::Error;
    use std::fs;

    fn encode_and_decode(
        d_hex: &str,
        V: usize,
        C: usize,
        num_trials: usize,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let W_E = C * 2;
        let mut d_bytes = hex::decode(d_hex.trim_start_matches("0x"))?;
        let d_bytes_len = d_bytes.len();
        if d_bytes.len() % W_E != 0 {
            let pad_len = W_E - (d_bytes.len() % W_E);
            d_bytes.extend(std::iter::repeat(0).take(pad_len));
        }

        let shard_size = d_bytes.len() / C;
        let k = d_bytes.len() / W_E;
        let mut original_shards: Vec<Vec<u8>> = vec![Vec::with_capacity(2 * k); C];
        let mut recovery_shards: Vec<Vec<u8>> = vec![Vec::with_capacity(2 * k); V - C];

        for i in 0..k {
            let mut encoder = ReedSolomonEncoder::new(C, V - C, 2)?;
            for c in 0..C {
                let shard = [
                    d_bytes[i * 2 + c * shard_size],
                    d_bytes[i * 2 + c * shard_size + 1],
                ];
                encoder.add_original_shard(&shard)?;
                original_shards[c].extend_from_slice(&shard);
            }

            let encoded = encoder.encode()?;
            for (j, shard) in encoded.recovery_iter().enumerate() {
                recovery_shards[j].extend_from_slice(shard);
            }
        }

        let output_json = json!({
            "segment": d_hex,
            "shards": original_shards
                .iter()
                .chain(recovery_shards.iter())
                .map(|s| format!("0x{}", hex::encode(s)))
                .collect::<Vec<String>>(),
        });

        let bs = if d_bytes_len == 4104 {
            "segment"
        } else {
            "bundle"
        };
        let sz = if V == 6 { "_tiny" } else { "_full" };
        let fn_ = format!("test_{}_{}{}.json", bs, d_bytes_len, sz);
        fs::write(&fn_, serde_json::to_string_pretty(&output_json)?)?;

        let all_shards: Vec<&[u8]> = original_shards
            .iter()
            .chain(recovery_shards.iter())
            .map(|v| v.as_slice())
            .collect();

        let mut success_count = 0;
        let mut rng = thread_rng();

        for trial in 0..num_trials {
            let mut indices: Vec<usize> = (0..V).collect();
            indices.shuffle(&mut rng);
            let selected: Vec<usize> = indices[..C].to_vec();

            let mut shard_buffer = vec![0u8; C * shard_size];
            let mut index_buffer = vec![0u32; C];

            for (i, &idx) in selected.iter().enumerate() {
                shard_buffer[i * shard_size..(i + 1) * shard_size]
                    .copy_from_slice(&all_shards[idx]);
                index_buffer[i] = idx as u32;
            }

            let mut output = vec![0u8; d_bytes.len()];

            for i in 0..k {
                let mut decoder = ReedSolomonDecoder::new(C, V - C, 2)?;
                for (j, &index) in index_buffer.iter().enumerate() {
                    let shard = &shard_buffer[j * shard_size + i * 2..j * shard_size + i * 2 + 2];
                    if (index as usize) < C {
                        decoder.add_original_shard(index as usize, shard)?;
                        let offset = i * 2 + index as usize * shard_size;
                        output[offset..offset + 2].copy_from_slice(shard);
                    } else {
                        decoder.add_recovery_shard(index as usize - C, shard)?;
                    }
                }

                {
                    let result = decoder.decode();
                    if let Ok(decoded) = result {
                        for (index, segment) in decoded.restored_original_iter() {
                            let offset = i * 2 + index * shard_size;
                            output[offset..offset + 2].copy_from_slice(segment);
                        }
                    } else {
                        println!("❌ decode failed at trial={}, row={}", trial, i);
                        continue;
                    }
                }
            }

            let trimmed = &output[..d_bytes_len];
            if trimmed == &d_bytes[..] {
                println!("✅ trial {} succeeded", trial);
                success_count += 1;
            } else {
                println!("❌ trial {} mismatch", trial);
            }
        }

        assert_eq!(success_count, num_trials, "Some decode trials failed");
        println!(
        "✅ encode+decode SUCCESS — all {} trials passed for {} bytes into {} shards ({} original, {} recovery)",
        num_trials,
        d_bytes_len,
        V,
        C,
        V - C
    );

        Ok(())
    }

    #[test]
    fn test_encode_and_decode() -> Result<(), Box<dyn Error>> {
        let b268 = "0x0000000000a649a61ab2617164cb87e2ed05859dba1fa352ca4ac9b4aa13bf36fb42708e04009a1e038a6f623e1e382a39d522d8a47d55ecd8c8940355d5044e7077d6f43082484dc3d969a6419862646f2c212e5251322c2144289dc445f02024d2834d5915675f9e53123c83ddcdb2c1f5231f13646378aefc83837a4571d052ac800148379a1e038a6f623e1e382a39d522d8a47d55ecd8c8940355d5044e7077d6f430821d462100000100000000f7a896797fbfab3d4e770a72fd8bfe3aa2011adc32e639142641834f2b0e70b724080f033802100d4a080edc172c4ca476afcfef203a40bed4415ff3db8288c2e598210000e803000000000000e80300000000000000000000000000"; // unchanged
        let s4104 = "0xeb390c02e701e9c3584bfc5ce48c64fc804526778fe6fc3e51850fcd9db19512d5395a6402a72fac3c169ff9bae6826eedc2c94dc99ab7ec60e5fb8000030fd54cfe3d9c29efc766aad3d3781ecc9c7ed0616c799fb2eccee0ee1897c971a386f51dd3c70e0ebcc30511112c7d6a008a6463c8a1bb7ee86e683787cbfac83a4516cb4417e3e02104e1e5a2e81c252b95ee5125f0f1a7cafc315013526c1e01dd1f8493dfac8364bb60d984d76e59a0c2227b128050722535e9fda3ff313e447cfe1132245848b436f7863e6520e9c7909d5f1d2bac4918ec2667931ad29552eccca417f9eb2882d42c695374d27216eb40f32965671e528843a064cd2ff1c5520725cf2e57076b9117fafc8ba832c7f887368e03b6506bcf1caa99b39baab9315419e1025c74f444548815896a5f76055f8757d9ca964609e50e8de160bedc67aa69d7895c8b8daf8c9f9657851ef07f02d2fea5bd8c94fb74e0c4115c60829d018a8b445b3f0d12622bea132655ff59b7bd652e26bac52f1f4fcc2dd6507c75b3c51de0bd7d0f7d413fe770a1fab20448554ad94625dd2d60d53dcbc684fd557a1f7fe19bf0cd5d0f199df4037e4bdbc86317ed9848fb6b3d9c8103c0cc9e01b46b7e6c02f539ede5139317f6d4d376df0e7ed6df983ce88e6c4270ec71533e880d8be0b64e4344e82a45e9a6b6175fc83ec47fd3b2d3d71e626470ffe08b6acf6c2f6abef83151f50213264f50631003ad98cd56bc947f829c3389816f065664afa37710bb42492f74336fb3e632f7f5c5382d5994b154814a2572c55896da57be0ab4a769a5c45f3ad1f3d6c67da2afa3ccbbc4ba9747dd2c8131ee15033b4b2100833e4e40429edcf0ef1448bf4be435abded1defe82dbab76332702e60bbdd6de8513acd6c0bc9c6d091af77bc977e67c7cd5324a4e6b1b050b6ab2f90ea9e41f29703ea98d990e9189d8341c338f0a2cf4895e480d94e7d329b0fbddb76fc5d1e09108d76be101445de68d3161492c97742ab1af9386f3fc76f6893e087f83584f17d3785ac1ee83966421b3170289e459a19051cedd05c69e7acae2547c94a6df5efe316dd4aed33db08d3ebff01276efdf40d1f82f352c3f22eca91c934898271cb0a5fb4d3833952ab67c711e1e1bbdae8b0e2d72392ebbe656ba795c2d56289b02e5b28bc822a53a6665d85ebb077112e9129bb9a211e831bf0ba503a97eed21a2325894f943c303e0ea61b0b90f5d4b5f5cee1702cb39d5620899978233432169c961504d89a9f9c37b24ff204dcaba0795714b54581382c95d8c726cb1d65299aaf691381cb7ab7c5ca6fc44a8ce04ef71748ab8cfa608a81abe1ae1a60bcf8b6a14e7fa7721cf7ccc561334bd523c4d1a232baaf9e1481ad549adab6dd24ccd469725d1829bb7871a4b14b86bdbc600fa16a44d8771b79ad0e40b3e8a268985d1d41284cbe3fbc42483e49338bdb4e0d2a60802830ce9d2500be91106f176a9aa678148e01d719acb2995e71839bfff4bf8b9aaf59a1f52ab340769c4e44a59af881c83252392f4023193f916cfc2a851ac88e44b9255dcc2ba530c7e83606c15fc774f0bf52e6c69cbda09566b81a9f446e551036a6263cf1c912670645acc9fd16ac7473bd05f275137accc06a50d71444f0712d92c24f27d4bc7421b06313def28f4accf2fe32f2f8dc0ccf8e044b8e03e09efffdba58faee83757963f31fb35cd239a3b07a63b5000b2b195bf2d6808273b3ba7fb0fbb209f60fc37cce70414a86b9611a594bc2316ed5d23c857fc340832009e70430b654eead53da3280ef94d82587391b6751ab77879420aa664dd948e77a5311db7d619797eb8e0420da67a7c625c568fa242b0a19c48bdb1324ff005f52ea77ccdd18b043f008e4991a0cebdbac9a779dc6fe4b9c13dade3fe8aad85c889b1fa63297afebdeb8bfbff5c9cabd9bb361f5317e1db7a2dfc40b12376cd301b40d5778ab6b11b761e2ff5ba473f23bd8115bc9df7ecb80e24d2bcaf4bfe2153ec93af2e2354db0df0bd7268fd35310a7fc6bbe8f72cff9f02a362504f702d21580566fcc1737d85bb8dac4f3a6ca2a6245b324a2a821d4e5a8ec582dee7e963642ab5a7e0f0ed82f3f04eff76b76b00ce4a5203f95e48aac5f8aa5ad95af57fba4280c46c73aaffee2f0708b5e00a4912ee347fd19dd52dd167d15d2d4c10cb08dd70c40df0d9380e5f57c3a0f93a705559e530e813079ba3ab66fec0f0d09947fb6ecc50e9c93eaa3b97fd015d143777875312be9ddb4d4d5e73b9e8a2ac0bc20279e71a4cb8f23e84c42c4ba0ea42735ba2c71374d31b57d702cd49af224114d78b72156816f1335a23094bd3d9cddb9bad14759f621e68610dc71138f32cead2afb223f902acb871160c0038e4c7a807c280884ea16125e4c9215a6b03564e62cdb278fe39054eb782cfe1c5e6ca039b840924e38800b9da5dd998ac57834157ed565bc06d1330977341d93ac2c3ad614677a9c83f22d67e921395e037413f44424877a4debc38cb7bc12e80c34089d32385cc4dd6694ee6db3b1ac64ba7416e189b517964b9c81689d86c63c855aa46e93e2cf9c9cb87e78c46dcc26dbfcc15b91595b88629ce090248f237ec5f170f88cc743edf576f7304d2a94e884cd38571ca05b7bec23632310f6476215a18096a93d7c5005c06ff573778cbe86b269096d0f120b03e05bbe391431621d91806abda5510cb3f0aa3ed22dcaad80f9714b6d0a580f695b69ca276b35ce68afe7069a8dd1df2108c154e6f351c2c13e4c770b6e33c3a893e5d3a055e4ee25dc0b14f39958a58515c22b9d21f421be1c0274af21a8bc14d6d4c75cdd92f5f0ae654c8108719ebbf4176921cb81a1b29a20f2fb8e07baf627afaf02617f971ade3d2732160d0caa75458c296419428846649a43ce63a0982a73d8632cb85457657e7323596d7d9f67b6cc0d9f367b77e88d68b97e7019342437b0ffde8a2bc51fbd3aeb9223eb5647377f6e70c5a5aba5833396aca89125dcdcf59d5e49ab050da56b30440a2df1c4bb90cae08162906b6139e7c63e2eb2b6dfc39d5890e09360df9bc0dffe7541d878d01a481926ebff2b8a0fdb4a75aba0f4d02409b680d0aed67f59ece8e5961eb5a180f7c04158dc2e66c5b5ebc147150cefcea3371b2ba3c9013f8d44e7f168ab98d30ca3666659d9ea5b1b04a85403ea8c0ea53064d1fb3d352e203d3f7d85d6c8cc3d7397e396ac5e63dcce71fbf5e420d132bb0819c3214f847c4b6409f6afe0b5e77710f652ffb4dea8ce486cfff41783ebf5da9f364ff36f01bcc678e446c636d1049d2f4fe1cfee0556dc9fb44741374204e86f16f3d4f8aab66291732d01e3384abec84ff221f03ae17f821c392766b2ba6b3d26ff42bc5283432be535836991877a54be5d76c7621ea5ceb57bd7e0662515f2adfd97f5c7bd88e94307597925b9c2d45e745a72e469c70de62bfe8bfcbd5d07dee52bc02a491234a77b5c46e180fef00bda23cc04a8ede15af37d886f622ca50ba2a01372da59ca0631d03422facbb1f5080a9d3eb3ac6a751c5b19299c4e90343e7d81e96682fff3c780023f7b71a870ed26be23be4e906bc10df96ded9452e1e6e584cc83a407b09550a645e0b1a144e30da47445cb27a11272e4ea73a2b745842a504b6cbd0b63f605058d7f867d9c6033eabcc22698348e9e4bc37ec65d1812ce6170d8191961e3cdee4e44dcb50f763afaaf16cb19043beb00295556862d95eb850dd13791a32cacfa51f9811082b3d203bf6d8d118cfdc907c5e2929fce61b6c9ea3575dbe3a1fbb95a6fbe49ea66f879e5b511ad0ca2c044ef994e808840448cbb4e9265e5b190995c39222e586b89556770a8b35993fb5ce0034cd3f158bafc52b85fe509af868a407c3fba10c806c7a6d8fbae34b28e96f693e326821fd5918c6e87ca6d8909f22261d218b60fa5336a5efb2c6fff446a7a48c8167d91718605960582c75bef2e4b403bc7b15166caa9a0be3e0a677da2f1c9c597259c5fbb703e63f2ba518f8e36201378be8d4e47229a25dc8f7d8f3e9fed447728d25cf92e43492ae0aa1d6b98ebf6a9991e0286e871275325b96f9ab1820a589adcaa43f9ede8982515246ebd60fb7b84da1740bd170a0062b21c5df08743dcb57bd922e09c367f07844308d12b519dfecf44b17f49c5fabcb788599325152cf848d882515806a4d5f779c9332994652b29b3424f974f5e0eab60d3db12055553f73595a3cddd44fafa7ce9f6a687d109f216a4b9f12c69aaf28c7c71dabf4c41f95946e96d0f0e1a15e88814608b7df0a84a456b77de41a0aabc7176a20ab28f613d546acb91985ff12a2e9f91dfd90d4f99bc1a2a9c0035b48c567f3aba539988005309ad00ecba017d20d1375e04eb85c638e5c8607587a7c2e691c0b5c1142d334db754def52a1dff72347fc3dd34fbf8fb1da5fd8c74baa384d97900b6c03d399f2bb731ca882785218c6fe7ea52840416edee611463f90567cc35c26e27bac7b07fdbaf153014bbc0c994fc96624869cfa40f95a96dbfda343a9279fbf83beb2e898b36e37a6e850a46a49c79779756caddb12497d9b16021bc38d671e24eb252c5413756ab0fafc5830d40ab036dac341541a24b538eed6fff78dd071d2c53878e9f125ad8b35d7a95ea889acda13c7bb608d3fbceccbd615f456056e930ef73f41b76c6479dc9dbc0bd633eedc4d1c48e883fa96cf16fe1277aea7f19fe91c0dc3d26e169a1c1fbe03fb147653935dfc9b81eaf4989162ca77478537609f131224bcf460b149952f679c02fb4e2c54ead4da33caf9e927e094b547ff387e417bb7a1222fd1a6e2e33c615939415db428136ba81261c33925070bc88f4f15a2c1b6bd762f6b368fd08ea4eb1ee177a67dadfee60718a2a7b02c2701d65fc15db2583ac7eb00c3c3a84378a2a1439d35a11461b99c85f065ba6f2a4f5dcf566d6f453290a3020463318882435d3de0ef5f9f965d72232035f19085e7fa005bc6fa549e93dfbfcb0f3bf79b30c45e894732c5cffc19ab98dc2adf1d28e2b4e8fca307dca99104ff74e9cc1b002d063ee10758491212df24ad0e14bed434dcd6f003937026a6f9d81d531e54a10ef2fb3f08de3a0a9a0cd2fb8bc65f6cb7e453e4a1143bf1e97ae4970125a4fa90431bfd85ec71a46f79e765428440e59248bf6e093020fe8254dce862817e613d49b573674e34c3825e614e404650cc2b747280255665d6be8a11c59e07294cf72c90afab9c0e31fff87aa01efaae426b1c7a06e5c133f2baba8d382f97c4bfec2cfd12a4fa5f888ec8d099b0741b86d80a8036eac8a68959f7c04a28297cf2052b268946216df5ace51464cc7902d1740a070f18319a0d6a3aeba2f496e47d832219e71256640216336c7f7f31cf1fc3560e391b62fa9a2d76c03484a635e00689b9ce2cb4fb8c0e5e08d68f3ca909221f89e211267c013f28e04503bd548b0cf213f428084381f9ec4c2d96e3bb8e8cf4a97f829d4dd63564ded50398cd2efb1de7ccfdc06a1e728fb83eec5fcbaf54924fc41f025f615af4b0b3e686bd811fa90364f042a68ca094327838edc84c1612460cc485d88eae02193ab3e332167c87196d27f744244939281b8841a168dc06b2b47d44f7eab1c38b0fd67d6b5dcf2aa82f1fe861894c080749b36f196713d6a982ea469e8eeae90b685674b25c477dde47cf0d3b7061519641e71f5a09ef94fe1700375888109ce237923023cf942daf52724d0dad1a781024b2";
        encode_and_decode(b268, 6, 2, 3)?;
        encode_and_decode(s4104, 6, 2, 3)?;
        Ok(())
    }
}
