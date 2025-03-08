// useWorkReportStatuses.ts
import { useState, useEffect } from "react";
import { db } from "@/db/db";

export function useWorkReportStatuses(
  reportHashes: string[],
  currentSlot: number,
  maxChecks: number = 10
): Record<string, string> {
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function updateStatuses() {
      const newStatuses: Record<string, string> = {};
      for (const hash of reportHashes) {
        let slotToCheck = currentSlot + 1;
        let foundStatus = "Pending";
        let checks = 0;
        while (checks < maxChecks && !cancelled) {
          const nextBlock = await db.blocks
            .where("overview.slot")
            .equals(slotToCheck)
            .first();
          if (!nextBlock || !nextBlock.overview?.headerHash) {
            break; // no further block available
          }
          const nextState = await db.states
            .where("overview.headerHash")
            .equals(nextBlock.overview.headerHash)
            .first();
          if (nextState && Array.isArray(nextState.xi)) {
            // Check if any entry in xi contains the report hash.
            const found = nextState.xi.find((entry: string[]) =>
              entry.includes(hash)
            );
            if (found) {
              foundStatus = `Accumulated on slot ${nextBlock.overview.slot}`;
              break;
            }
          }
          slotToCheck++;
          checks++;
        }
        newStatuses[hash] = foundStatus;
      }
      if (!cancelled) {
        setStatuses(newStatuses);
      }
    }

    updateStatuses();
    return () => {
      cancelled = true;
    };
  }, [reportHashes, currentSlot, maxChecks]);

  return statuses;
}
