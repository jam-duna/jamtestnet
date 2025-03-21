"use client";

import { useEffect } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";
import { getRpcUrlFromWs, normalizeEndpoint } from "@/utils/ws";
import { useInsertMockDataIfEmpty } from "@/utils/debug";

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
  // useInsertMockDataIfEmpty();

  useEffect(() => {
    console.log(
      "[START] | Connecting via native WebSocket to",
      wsEndpoint,
      "..."
    );
    const normalEndpoint = normalizeEndpoint(wsEndpoint);

    const ws = new WebSocket(normalEndpoint);

    ws.onopen = () => {
      console.log(`[OPEN] | ${normalEndpoint}`);
    };

    ws.onmessage = (event) => {
      // Delay processing by 1 second.
      setTimeout(async () => {
        try {
          const msg = JSON.parse(event.data);
          console.log(`[MESSAGE] | Received msg ->`, msg);

          if (msg.method === "BlockAnnouncement" && msg.result) {
            localStorage.setItem("customWsEndpoint", wsEndpoint);
            // Only add if it is not already saved.
            setSavedEndpoints((prev) => {
              const updated = prev.includes(wsEndpoint)
                ? prev
                : [...prev, wsEndpoint];
              localStorage.setItem("savedWsEndpoints", JSON.stringify(updated));
              return updated;
            });

            const headerHash = msg.result.headerHash;
            const blockHash = msg.result.blockHash;

            const rpcUrl = getRpcUrlFromWs(wsEndpoint);
            console.log("RPC URL:", rpcUrl);

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
          console.log("Error parsing WebSocket message ->", err);
        }
      }, 1000);
    };

    ws.onerror = (error) => {
      console.log(`[ERROR] | ${normalEndpoint} ->`, error);
      // console.error("WebSocket error:", error);
      // ws.close();
    };

    ws.onclose = () => {
      console.log(`[CLOSED] | ${normalEndpoint}`);
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
