import { useEffect, useState } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlock } from "@/hooks/home/useFetchBlock";
import { fetchState } from "@/hooks/home/useFetchState";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { getRpcUrlFromWs } from "@/utils/ws";

export function useBlockOverview(input: string, type: "hash" | "slot") {
  const [blockRecord, setBlockRecord] = useState<Block | null>(null);
  const [stateRecord, setStateRecord] = useState<State | null>(null);
  const [prevHash, setPrevHash] = useState<string | null>(null);
  const [nextHash, setNextHash] = useState<string | null>(null);
  const wsEndpoint = localStorage.getItem("customWsEndpoint") || null;
  const rpcUrl = getRpcUrlFromWs(wsEndpoint || DEFAULT_WS_URL);

  async function fetchDbData(input: string, type: "hash" | "slot") {
    try {
      if (type === "hash") {
        const block = await db.blocks
          .where("overview.headerHash")
          .equals(input)
          .first();
        const state = await db.states
          .where("overview.headerHash")
          .equals(input)
          .first();
        return { block, state };
      } else {
        const block = await db.blocks
          .where("overview.slot")
          .equals(Number(input))
          .first();
        const state = await db.states
          .where("overview.slot")
          .equals(Number(input))
          .first();
        return { block, state };
      }
    } catch (error) {
      console.error("Error fetching DB data:", error);
      return { block: undefined, state: undefined };
    }
  }

  async function fetchNeighborHashes(currentSlot: number) {
    try {
      const prevBlock = await db.blocks
        .where("overview.slot")
        .equals(currentSlot - 1)
        .first();
      const nextBlock = await db.blocks
        .where("overview.slot")
        .equals(currentSlot + 1)
        .first();
      setPrevHash(prevBlock?.overview?.headerHash || null);
      setNextHash(nextBlock?.overview?.headerHash || null);
    } catch (error) {
      console.error("Error fetching neighbor blocks:", error);
    }
  }

  {
    /*
    async function fetchRealTimeData() {
    try {
      // Directly fetch the block from the server based on the type.
      const fetchedBlock = await fetchBlock(input, rpcUrl, type);
      console.log("blocks are here: ", fetchedBlock);

      if (fetchedBlock) {
        setBlockRecord(fetchedBlock);

        // If searching by hash, also fetch the state data.
        if (type === "hash") {
          const fetchedState = await fetchState(input, rpcUrl);
          setStateRecord(fetchedState);
        }
      } else {
        // Ensure fetchDbData always returns an object
        const dbData = await fetchDbData(input, type);
        console.log("Fetched block DB:", dbData.block);
        console.log("Fetched state DB:", dbData.state);
        setBlockRecord(dbData.block ?? null);
        setStateRecord(dbData.state ?? null);
      }
    } catch (error) {
      console.error("Error fetching block overview:", error);
    }
  }
    */
  }

  async function fetchRealTimeData() {
    try {
      const dbData = await fetchDbData(input, type);
      console.log("[LOG] Blocks: ", dbData.block);
      console.log("[LOG] States: :", dbData.state);

      if (dbData.block) {
        setBlockRecord(dbData.block);
        if (dbData.state) setStateRecord(dbData.state);
      } else {
        // Directly fetch the block from the server based on the type.
        const fetchedBlock = await fetchBlock(input, rpcUrl, type);
        console.log("[LOG] Blocks: ", fetchedBlock);
        setBlockRecord(fetchedBlock ?? null);

        // If searching by hash, also fetch the state data.
        if (type === "hash") {
          const fetchedState = await fetchState(input, rpcUrl);
          setStateRecord(fetchedState);
        } else {
          setStateRecord(null);
        }
      }
    } catch (error) {
      console.error("Error fetching block overview:", error);
    }
  }

  useEffect(() => {
    if (!input) return;

    (async () => {
      try {
        const dbData = await fetchDbData(input, type);
        console.log("[LOG] DB Blocks: ", dbData.block);
        console.log("[LOG] DB States: ", dbData.state);

        if (dbData.block) {
          setBlockRecord(dbData.block);
          if (dbData.state) setStateRecord(dbData.state);
        } else {
          // Directly fetch the block from the server based on the type.
          const fetchedBlock = await fetchBlock(input, rpcUrl, type);
          console.log("[LOG] Blocks: ", fetchedBlock);
          setBlockRecord(fetchedBlock ?? null);

          // If searching by hash, also fetch the state data.
          if (type === "hash") {
            const fetchedState = await fetchState(input, rpcUrl);
            setStateRecord(fetchedState);
          } else {
            setStateRecord(null);
          }
        }
      } catch (error) {
        console.error("Error fetching block overview:", error);
      }
    })();
  }, [input, type, rpcUrl]);

  {
    /*
    useEffect(() => {
    if (blockRecord && type === "hash") {
      const currentSlot = blockRecord.header.slot;
      fetchNeighborHashes(currentSlot);
    }
  }, [blockRecord, type]);
    */
  }

  return { blockRecord, stateRecord, prevHash, nextHash };
}
