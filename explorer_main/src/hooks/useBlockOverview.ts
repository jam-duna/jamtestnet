import { useState, useEffect } from "react";
import { db, BlockRecord, StateRecord } from "@/db/db";

export function useBlockOverview(hash: string, type: string) {
  const [blockRecord, setBlockRecord] = useState<BlockRecord | null>(null);
  const [stateRecord, setStateRecord] = useState<StateRecord | null>(null);
  const [prevHash, setPrevHash] = useState<string | null>(null);
  const [nextHash, setNextHash] = useState<string | null>(null);

  useEffect(() => {
    if (hash && type === "headerHash") {
      db.blocks
        .where("headerHash")
        .equals(hash)
        .first()
        .then((record) => {
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });

      db.states
        .where("headerHash")
        .equals(hash)
        .first()
        .then((record) => {
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }

    {
      /*
      else if (hash && type === "blockHash") {
      db.blocksFetchBlockHash;
      db.blocksFetchBlockHash
        .where("blockHash")
        .equals(hash)
        .first()
        .then((record) => {
          setBlockRecord(record ? record.data : null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
      */
    }
  }, [hash]);

  useEffect(() => {
    if (blockRecord && type === "headerHash") {
      const currentSlot = blockRecord.block.header.slot;
      db.blocks
        .where("block.header.slot")
        .equals(currentSlot - 1)
        .first()
        .then((prevBlock) => {
          setPrevHash(prevBlock?.headerHash || null);
        });
      db.blocks
        .where("block.header.slot")
        .equals(currentSlot + 1)
        .first()
        .then((nextBlock) => {
          setNextHash(nextBlock?.headerHash || null);
        });
    }
  }, [blockRecord]);

  return { blockRecord, stateRecord, prevHash, nextHash };
}
