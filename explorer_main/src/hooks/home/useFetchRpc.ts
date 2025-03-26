// this hook is for fetching latest block using getBlockBySlot() RPC call.

import { useEffect, useState } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlockBySlot } from "./useFetchSlot";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";

interface UseFetctRpcParams {
    rpcUrl: string;
    onNewBlock: (blockRecord: Block, stateRecord: State) => void
}

export function useFetchRpc({rpcUrl, onNewBlock}: UseFetctRpcParams) {
    const [slotDeterminded, setSlotDeterminded] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(0);

    useEffect(() => {
        (async () => {
            // get the current slot of the chain
            if (slotDeterminded === false) {
                // calculate the estimating slot id
                const now = new Date();
                const seconds = now.getMinutes() * 60 + now.getSeconds();
                const estSlot = Math.floor(seconds / 6 + 12);
                // console.log("Estimating Slot Id: ", estSlot);

                // get current slot of the time
                let curSlot = estSlot;
                let result = null;
                while(result === null) {
                    result = await fetchBlockBySlot(curSlot--, rpcUrl);
                    
                    if (curSlot < 12) {
                        break;
                    }
                }

                console.log("Current Slot: ", ++curSlot);
                console.log(await fetchBlockBySlot(curSlot, rpcUrl));

                setCurrentSlot(curSlot);
                setSlotDeterminded(true);
            } else {
                // fetch up coming block
                // console.log("fetch up coming block...");
                const intervalId = setInterval(async() => {
                    const response = await fetchBlockBySlot(currentSlot + 1, rpcUrl);
                    // console.log("refetching block ", currentSlot + 1);
                    // console.log("response ", response);
                    if (response !== null) {
                        setCurrentSlot(currentSlot + 1);

                        console.log("Block Announcement: ", currentSlot + 1);
                        console.log("Block Announcement: ", response);
                        
                        const parent_hash = response.header.parent;
                        console.log("Parent Hash: ", parent_hash);

                        const fetchedBlock = await fetchBlock(parent_hash, rpcUrl);
                        const fetchedState = await fetchState(parent_hash, rpcUrl);
                        const overview = {
                            headerHash: parent_hash,
                            blockHash: parent_hash,
                            createdAt: Date.now(),
                            slot: fetchedBlock.header.slot,
                        };

                        if (fetchedBlock.header && fetchedBlock.extrinsic) {
                            const blockRecord: Block = {overview, ...fetchedBlock};
                            await db.blocks.put(blockRecord);

                            if (fetchedState) {
                                const stateRecord: State = {overview, ...fetchedState};
                                await db.states.put(stateRecord);

                                onNewBlock(blockRecord, stateRecord);
                            }
                        }

                        clearInterval(intervalId);
                    }
                }, 3000);
            }
        })();
    }, [rpcUrl, currentSlot, slotDeterminded]);
}