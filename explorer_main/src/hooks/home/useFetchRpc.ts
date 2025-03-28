// this hook is for fetching latest block using getBlockBySlot() RPC call.

import { useEffect, useRef, useState } from "react";
import { db, Block, State, DB_LIMIT } from "@/db/db";
import { fetchBlockBySlot } from "./useFetchSlot";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";

interface UseFetctRpcParams {
  rpcUrl: string;
  onNewBlock: (blockRecord: Block, stateRecord: State | null) => void;
}

export function useFetchRpc({ rpcUrl, onNewBlock }: UseFetctRpcParams) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSlotRef = useRef<number>(0);

  const fetchLatestBlocks = async () => {
    await db.blocks.clear();
    await db.states.clear();
    const response = await fetchBlockBySlot("latest", rpcUrl);
    if (response !== null) {
      const currentSlot = response.header.slot;
      let i = Math.max(currentSlot - DB_LIMIT + 1, 12);
      for (; i <= currentSlot; ++i) {
        const block = await fetchBlockBySlot(i.toString(), rpcUrl);
        if (!block) {
          console.error(`Block for slot ${i} not found.`);
          continue; // or return, depending on your logic
        }
        const state = await fetchState(block.header_hash, rpcUrl);
        const overview = {
          headerHash: block.header_hash,
          blockHash: block.header_hash,
          createdAt: block.timestamp,
          slot: block.header.slot,
        };
        db.blocks.put({ overview, ...block });

        if (state) {
          db.states.put({ overview, ...state });
          onNewBlock({ overview, ...block }, { overview, ...state });
        } else {
          onNewBlock({ overview, ...block }, null);
        }
      }
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      return;
    }

    const fetchCurrentDbState = async () => {
      const bCount = await db.blocks.count();
      const sCount = await db.states.count();

      console.log("Current DB State", bCount, sCount);

      if (bCount < DB_LIMIT && sCount < DB_LIMIT) {
        await fetchLatestBlocks();
      }
    };

    const fetchJam = async () => {
      const bCount = await db.blocks.count();
      const sCount = await db.states.count();

      console.log("Current DB State", bCount, sCount);

      if (bCount === DB_LIMIT && sCount === DB_LIMIT) {
        const response = await fetchBlockBySlot("latest", rpcUrl);
        if (response !== null) {
          const currentSlot = response.header.slot;
          if (lastSlotRef.current !== currentSlot) {
            lastSlotRef.current = currentSlot;
            console.log(
              "Block Announcement: (Slot, Timestamp)",
              response.header.slot,
              response.timestamp
            );
            const overview = {
              headerHash: response.header_hash,
              blockHash: response.header_hash,
              createdAt: response.timestamp,
              slot: response.header.slot,
            };
            const fetchedState = await fetchState(response.header_hash, rpcUrl);
            if (response.header && response.extrinsic) {
              const blockRecord: Block = { overview, ...response };
              await db.blocks.put(blockRecord);
              if (fetchedState !== null) {
                const stateRecord: State = { overview, ...fetchedState };
                await db.states.put(stateRecord);
                onNewBlock(blockRecord, stateRecord);
              }
            }
            const blockCount = await db.blocks.count();
            if (blockCount > DB_LIMIT) {
              const oldest = await db.blocks
                .orderBy("overview.createdAt")
                .first();
              if (oldest?.overview) {
                await db.blocks.delete(oldest.overview.headerHash);
              }
            }
            const stateCount = await db.states.count();
            if (stateCount > DB_LIMIT) {
              const oldest = await db.states
                .orderBy("overview.createdAt")
                .first();
              if (oldest?.overview) {
                await db.states.delete(oldest.overview.headerHash);
              }
            }
          }
        }
      }
    };
    intervalRef.current = setInterval(fetchJam, 3000);
    fetchCurrentDbState();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [rpcUrl]);
}
