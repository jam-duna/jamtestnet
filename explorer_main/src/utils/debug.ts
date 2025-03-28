"use client";

import { useEffect } from "react";
import { db, Block, State } from "@/db/db";
import { mockBlocks } from "@/components/mock/block";
import { mockStates } from "@/components/mock/state";

export function useInsertMockDataIfEmpty() {
  useEffect(() => {
    async function insertMockData() {
      try {
        // Check if there are any blocks or states
        const blockCount = await db.blocks.count();
        const stateCount = await db.states.count();
        if (blockCount === 0) {
          console.log(
            "No block data found in IndexedDB. Inserting mock data..."
          );

          for (const mockBlock of mockBlocks) {
            await db.blocks.put(mockBlock as Block);
          }
          console.log("Mock data inserted.");
        }
        if (stateCount === 0) {
          console.log(
            "No state data found in IndexedDB. Inserting mock data..."
          );

          /**
            for (const mockState of mockStates) {
              await db.states.put(mockState as State);
              await db.states.put(mockState as State);
            }
            console.log("Mock data inserted.");
            */
        }
      } catch (error) {
        console.error("Error inserting mock data", error);
      }
    }
    insertMockData();
  }, []);
}
