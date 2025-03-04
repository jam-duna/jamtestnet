import { useEffect } from "react";
import { db, BlockRecord, StateRecord } from "@/db/db";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";
import { getRpcUrlFromWs } from "@/utils/ws";

interface UseWsRpcProps {
  wsEndpoint: string;
  defaultWsUrl: string;
  onNewBlock: (blockRecord: BlockRecord, stateRecord: StateRecord) => void;
  onUpdateNow: (timestamp: number) => void;
  setSavedEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useWsRpc({
  wsEndpoint,
  defaultWsUrl,
  onNewBlock,
  onUpdateNow,
  setSavedEndpoints,
}: UseWsRpcProps) {
  useEffect(() => {
    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      console.log("WebSocket connected to:", wsEndpoint);
      setSavedEndpoints((prev) => {
        if (wsEndpoint !== defaultWsUrl && !prev.includes(wsEndpoint)) {
          return [...prev, wsEndpoint];
        }
        return prev;
      });
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === "BlockAnnouncement" && msg.result) {
          const headerHash = msg.result.headerHash;
          const blockHash = msg.result.blockHash;
          const rpcUrl = getRpcUrlFromWs(wsEndpoint);
          const fetchedBlock = await fetchBlock(headerHash, rpcUrl);
          const fetchedState = await fetchState(headerHash, rpcUrl);
          const nowTimestamp = Date.now();
          const overview = { blockHash, createdAt: nowTimestamp };

          if (fetchedBlock && fetchedBlock.header) {
            const blockRecord: BlockRecord = {
              headerHash,
              overview,
              block: fetchedBlock,
            };
            await db.blocks.put(blockRecord);

            if (fetchedState) {
              const stateRecord: StateRecord = {
                headerHash,
                overview,
                state: fetchedState,
              };
              await db.states.put(stateRecord);
              onNewBlock(blockRecord, stateRecord);
            }
          }
          onUpdateNow(nowTimestamp);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [wsEndpoint]);
}
