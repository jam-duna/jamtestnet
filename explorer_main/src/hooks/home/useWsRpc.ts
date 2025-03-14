import { useEffect } from "react";
import { db, Block, State } from "@/db/db";
import { fetchBlock } from "./useFetchBlock";
import { fetchState } from "./useFetchState";
import { getRpcUrlFromWs } from "@/utils/ws";

interface UseWsRpcProps {
  wsEndpoint: string;
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
          const overview = {
            headerHash,
            blockHash,
            createdAt: nowTimestamp,
            slot: fetchedBlock.header.slot,
          };
          console.log(fetchedBlock);

          if (fetchedBlock.header && fetchedBlock.extrinsic) {
            const blockRecord: Block = { overview, ...fetchedBlock };
            console.log(blockRecord);
            console.log("================================================");
            await db.blocks.put(blockRecord);

            if (fetchedState) {
              const stateRecord: State = { overview, ...fetchedState };
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
