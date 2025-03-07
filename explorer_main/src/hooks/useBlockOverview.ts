import { useState, useEffect } from "react";
import { db, Block, State } from "@/db/db";

export function useBlockOverview(hash: string, type: string) {
  const [blockRecord, setBlockRecord] = useState<Block | null>(null);
  const [stateRecord, setStateRecord] = useState<State | null>(null);
  const [prevHash, setPrevHash] = useState<string | null>(null);
  const [nextHash, setNextHash] = useState<string | null>(null);

  useEffect(() => {
    if (hash && type === "headerHash") {
      db.blocks
        .where("overview.headerHash")
        .equals(hash)
        .first()
        .then((record) => {
          console.log(record);
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });

      db.states
        .where("overview.headerHash")
        .equals(hash)
        .first()
        .then((record) => {
          console.log(record);
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    } else if (hash && type === "blockHash") {
      db.blocksFetchBlockHash
        .where("overview.blockHash")
        .equals(hash)
        .first()
        .then((record) => {
          console.log(record);
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });

      db.statesFetchBlockHash
        .where("overview.blockHash")
        .equals(hash)
        .first()
        .then((record) => {
          console.log(record);
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }
  }, [hash, type]);

  useEffect(() => {
    console.log(blockRecord);
    console.log(type);

    if (blockRecord && type === "headerHash") {
      const currentSlot = blockRecord.header.slot;
      db.blocks
        .where("header.slot")
        .equals(currentSlot - 1)
        .first()
        .then((prevBlock) => {
          console.log(currentSlot - 1, prevBlock?.overview?.headerHash);
          setPrevHash(prevBlock?.overview?.headerHash || null);
        });
      db.blocks
        .where("header.slot")
        .equals(currentSlot + 1)
        .first()
        .then((nextBlock) => {
          console.log(currentSlot + 1, nextBlock?.overview?.headerHash);
          setNextHash(nextBlock?.overview?.headerHash || null);
        });
    }
  }, [blockRecord, type]);

  return { blockRecord, stateRecord, prevHash, nextHash };
}
