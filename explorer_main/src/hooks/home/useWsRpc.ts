/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useRef } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";
import { getRpcUrlFromWs, normalizeEndpoint } from "@/utils/ws";
import { DEFAULT_WS_URL } from "@/utils/helper";

interface UseWsRpcParams {
  wsEndpoint: string;
  onNewBlock: (blockRecord: Block, stateRecord: State) => void;
  onUpdateNow: (timestamp: number) => void;
  setSavedEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useWsRpc({
  wsEndpoint,
  onNewBlock,
  onUpdateNow,
  setSavedEndpoints,
}: UseWsRpcParams) {
  // Create a ref to store the WebSocket instance.
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const normalEndpoint = normalizeEndpoint(wsEndpoint);
    console.log("=========================");
    console.log("[INPUT] | Using endpoint:", normalEndpoint);

    // If there's an existing connection, but its URL does not match the new normalized endpoint,
    // close it so we can create a new one.
    if (wsRef.current && wsRef.current.url !== normalEndpoint) {
      console.log(
        "[INFO] Endpoint changed. Closing old connection:",
        wsRef.current.url
      );
      wsRef.current.close();
      wsRef.current = null;
    }

    // If there is no connection, create a new one.
    if (!wsRef.current) {
      console.log(
        "[START] | Connecting via native WebSocket to",
        normalEndpoint,
        "..."
      );

      // debug purposes
      // localStorage.setItem("customWsEndpoint", normalEndpoint);

      wsRef.current = new WebSocket(normalEndpoint);

      wsRef.current.onopen = () => {
        console.log(`[OPEN] | ${normalEndpoint}`);
        localStorage.setItem("customWsEndpoint", normalEndpoint);

        if (normalEndpoint === normalizeEndpoint(DEFAULT_WS_URL)) return;

        setSavedEndpoints((prev) => {
          if (!prev.includes(wsEndpoint)) {
            const updated = [...prev, wsEndpoint];
            localStorage.setItem("savedWsEndpoints", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
        // localStorage.setItem("customWsEndpoint", wsEndpoint);
      };

      wsRef.current.onmessage = (event) => {
        // Delay processing by 1 second.
        setTimeout(async () => {
          try {
            const msg = JSON.parse(event.data);
            console.log(`[MESSAGE] | Received msg ->`, msg);

            if (msg.method === "BlockAnnouncement" && msg.result) {
              localStorage.setItem("customWsEndpoint", wsEndpoint);
              setSavedEndpoints((prev) => {
                if (!prev.includes(wsEndpoint)) {
                  const updated = [...prev, wsEndpoint];
                  localStorage.setItem(
                    "savedWsEndpoints",
                    JSON.stringify(updated)
                  );
                  return updated;
                }
                return prev;
              });

              const { headerHash, blockHash } = msg.result;
              const rpcUrl = getRpcUrlFromWs(wsEndpoint);
              console.log("RPC URL:", rpcUrl);

              const fetchedBlock = await fetchBlock(headerHash, rpcUrl);
              const fetchedState = await fetchState(headerHash, rpcUrl);

              console.log("block data:", fetchedBlock);
              console.log("state data:", fetchedState);

              const nowTimestamp = Date.now();
              const overview = {
                headerHash,
                blockHash,
                createdAt: nowTimestamp,
                slot: fetchedBlock?.header.slot,
              };

              if (fetchedBlock?.header && fetchedBlock?.extrinsic) {
                const blockRecord: Block = { overview, ...fetchedBlock };
                await db.blocks.put(blockRecord);

                if (fetchedState) {
                  const stateRecord: State = { overview, ...fetchedState };
                  await db.states.put(stateRecord);
                  onNewBlock(blockRecord, stateRecord);
                }
              }
              onUpdateNow(nowTimestamp);
            }
          } catch (err) {
            console.log("Error parsing WebSocket message ->", err);
          }
        }, 1000);
      };

      wsRef.current.onerror = (error) => {
        console.log(`[ERROR] | ${normalEndpoint} ->`, error);
      };

      wsRef.current.onclose = () => {
        console.log(`[CLOSED] | ${normalEndpoint}`);
        // You might implement reconnection logic here if needed.
      };
    }

    // Do not close the connection on cleanup so that it persists.
    return () => {
      // If you want to persist the connection across component unmounts,
      // do not close the WebSocket here.
    };
  }, [wsEndpoint]);
}
