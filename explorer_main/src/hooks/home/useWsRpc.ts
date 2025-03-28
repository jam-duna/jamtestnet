/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useRef } from "react";
import { db, Block, State, DB_LIMIT } from "@/db/db";
import { Overview } from "@/types";
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

        if (normalEndpoint !== normalizeEndpoint(DEFAULT_WS_URL)) {
          setSavedEndpoints((prev) => {
            if (!prev.includes(wsEndpoint)) {
              const updated = [...prev, wsEndpoint];
              localStorage.setItem("savedWsEndpoints", JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
          // localStorage.setItem("customWsEndpoint", wsEndpoint);
        }
      };

      wsRef.current.onmessage = (event) => {
        setTimeout(async () => {
          try {
            const msg = JSON.parse(event.data);
            console.log(`[MESSAGE] | Received msg ->`, msg);

            if (msg.method === "BlockAnnouncement" && msg.result) {
              localStorage.setItem("customWsEndpoint", wsEndpoint);
              const { headerHash, blockHash } = msg.result;
              const rpcUrl = getRpcUrlFromWs(wsEndpoint);
              console.log("RPC URL:", rpcUrl);

              const fetchedBlock = await fetchBlock(headerHash, rpcUrl, "hash");
              const fetchedState = await fetchState(headerHash, rpcUrl);

              const nowTimestamp = Date.now();
              // Ensure slot is a number, using -1 as a fallback if not present.
              const slot =
                fetchedBlock?.header?.slot !== undefined
                  ? fetchedBlock.header.slot
                  : -1;
              const overview: Overview = {
                headerHash,
                blockHash,
                createdAt: nowTimestamp,
                slot,
              };

              if (fetchedBlock?.header && fetchedBlock?.extrinsic) {
                let blockRecord: Block;
                if (fetchedBlock.overview) {
                  // Remove existing overview property and replace with our computed one.
                  const { overview: _, ...restOfBlock } = fetchedBlock;
                  blockRecord = { ...restOfBlock, overview };
                } else {
                  blockRecord = { ...fetchedBlock, overview };
                }

                // Insert the new block into the database.
                await db.blocks.put(blockRecord);

                if (fetchedState) {
                  const stateRecord: State = { overview, ...fetchedState };
                  await db.states.put(stateRecord);
                  onNewBlock(blockRecord, stateRecord);
                }

                // --- Clean-up Logic Using DB_LIMIT ---

                // For blocks:
                const blockCount = await db.blocks.count();
                if (blockCount > DB_LIMIT) {
                  const oldestBlock = await db.blocks
                    .orderBy("overview.createdAt")
                    .first();
                  if (oldestBlock?.overview) {
                    await db.blocks.delete(oldestBlock.overview.headerHash);
                  }
                }

                // For states:
                const stateCount = await db.states.count();
                if (stateCount > DB_LIMIT) {
                  const oldestState = await db.states
                    .orderBy("overview.createdAt")
                    .first();
                  if (oldestState?.overview) {
                    await db.states.delete(oldestState.overview.headerHash);
                  }
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
