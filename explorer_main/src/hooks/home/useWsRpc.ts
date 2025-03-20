"use client";

import { useEffect } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";
import { getRpcUrlFromWs } from "@/utils/ws";

interface UseWsRpcParams {
  wsEndpoint: string;
  setWsEndpoint: (endpoint: string) => void;
  defaultWsUrl: string;
  onNewBlock: (blockRecord: Block, stateRecord: State) => void;
  onUpdateNow: (timestamp: number) => void;
  setSavedEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useWsRpc({
  wsEndpoint,
  defaultWsUrl,
  onNewBlock,
  onUpdateNow,
  setSavedEndpoints,
  setWsEndpoint,
}: UseWsRpcParams) {
  useEffect(() => {
    console.log("Connecting via native WebSocket to", wsEndpoint);
    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      // Delay processing by 1 second.
      setTimeout(async () => {
        try {
          const msg = JSON.parse(event.data);
          console.log("Received:", msg);
          if (msg.method === "BlockAnnouncement" && msg.result) {
            const headerHash = msg.result.headerHash;
            const blockHash = msg.result.blockHash;
            // Use a hardcoded RPC URL (or change as needed)
            // const rpcUrl = "http://51.75.54.113:13372/rpc";
            const rpcUrl = getRpcUrlFromWs(wsEndpoint);
            console.log("RPC URL:", rpcUrl);
            //
            const fetchedBlock = await fetchBlock(headerHash, rpcUrl);
            const fetchedState = await fetchState(headerHash, rpcUrl);

            console.log("block data:");
            console.log(fetchedBlock);
            console.log("state data:");
            console.log(fetchedState);

            const nowTimestamp = Date.now();
            const overview = {
              headerHash,
              blockHash,
              createdAt: nowTimestamp,
              slot: fetchedBlock.header.slot,
            };

            if (fetchedBlock.header && fetchedBlock.extrinsic) {
              const blockRecord: Block = { overview, ...fetchedBlock };
              await db.blocks.put(blockRecord);

              if (fetchedState) {
                const stateRecord: State = { overview, ...fetchedState };
                await db.states.put(stateRecord);
                onNewBlock(blockRecord, stateRecord);
              }
            }
            onUpdateNow(nowTimestamp);

            setSavedEndpoints((prev) =>
              prev.includes(wsEndpoint) ? prev : [...prev, wsEndpoint]
            );

            onUpdateNow(Date.now());
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      }, 1000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [
    wsEndpoint,
    defaultWsUrl,
    onNewBlock,
    onUpdateNow,
    setSavedEndpoints,
    setWsEndpoint,
  ]);
}
