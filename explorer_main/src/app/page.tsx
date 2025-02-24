"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EndpointDrawer from "../components/home/EndpointDrawer"; // Adjust path as needed
import SearchBar from "../components/home/SearchBar";
import GeneralInfoBar from "../components/home/GeneralInfoBar";
import LatestBlocks from "../components/home/LatestBlocks";
import LatestReports from "../components/home/LatestReports";

import { db, BlockRecord, StateRecord } from "../../db"; // Updated DB scheme

const defaultRpcUrl = "http://localhost:9999/rpc";
const defaultWsUrl = "ws://localhost:9999/ws";

export default function HomePage() {
  // State for fetched block and state data from RPC calls.
  const [block, setBlock] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  // WebSocket endpoint management.
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);

  // Latest blocks loaded from IndexedDB.
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);

  // Current time for relative time calculation.
  const [now, setNow] = useState(Date.now());

  // Helper to compute relative time.
  function getRelativeTime(timestamp: number) {
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    if (secondsAgo < 0) return "0 s";
    if (secondsAgo < 60) return `${secondsAgo} s`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} m`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} h`;
    return `${Math.floor(secondsAgo / 86400)} d`;
  }

  // Create a new WebSocket when wsEndpoint changes.
  useEffect(() => {
    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      console.log("WebSocket connected to:", wsEndpoint);
      setSavedEndpoints((prev) => {
        if (wsEndpoint !== defaultWsUrl && !prev.includes(wsEndpoint)) {
          console.log("Saving new endpoint to list:", wsEndpoint);
          return [...prev, wsEndpoint];
        }
        return prev;
      });
    };

    ws.onmessage = async (event) => {
      console.log("Raw WebSocket message:", event.data);
      try {
        const msg = JSON.parse(event.data);
        console.log("Parsed WebSocket message:", msg);
        if (msg.method === "BlockAnnouncement" && msg.result) {
          const headerHash = msg.result.headerHash;
          const blockHash = msg.result.blockHash;

          const fetchedBlock = await fetchBlock(headerHash);
          const fetchedState = await fetchState(headerHash);

          console.log("Fetched Block:", fetchedBlock);
          console.log("Fetched State:", fetchedState);

          setBlock(fetchedBlock);
          setState(fetchedState);

          const nowTimestamp = Date.now();
          const overview = {
            blockHash: blockHash,
            createdAt: nowTimestamp,
          };

          // Save BlockRecord into IndexedDB.
          if (fetchedBlock && fetchedBlock.header) {
            const blockRecord: BlockRecord = {
              headerHash,
              overview,
              block: fetchedBlock,
            };
            try {
              await db.blocks.put(blockRecord);
              // console.log("BlockRecord saved with key:", headerHash);
            } catch (error) {
              console.error("Error saving BlockRecord:", error);
            }
          } else {
            console.warn("No valid block header to save.");
          }

          // Save StateRecord into IndexedDB.
          if (fetchedState) {
            const stateRecord: StateRecord = {
              headerHash,
              overview,
              state: fetchedState,
            };
            try {
              await db.states.put(stateRecord);
              // console.log("StateRecord saved with key:", headerHash);
            } catch (error) {
              console.error("Error saving StateRecord:", error);
            }
          }
          // Update "now" to refresh relative time display.
          setNow(nowTimestamp);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [wsEndpoint]);

  // Load latest blocks from IndexedDB whenever a new block is saved.
  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort(
          (a, b) => b.overview.createdAt - a.overview.createdAt
        );
        setLatestBlocks(sorted);
        // console.log("Latest blocks loaded from DB:", sorted);
      })
      .catch((error) => {
        console.error("Error loading blocks from DB:", error);
      });
  }, [block]);

  async function fetchBlock(blockHash: string) {
    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "jam_getBlockByHash",
      params: [blockHash],
    };
    try {
      const response = await fetch(defaultRpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (err) {
      console.error("Error fetching block:", err);
      return null;
    }
  }

  async function fetchState(headerHash: string) {
    const payload = {
      jsonrpc: "2.0",
      id: 2,
      method: "jam_getState",
      params: [headerHash],
    };
    try {
      const response = await fetch(defaultRpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (err) {
      console.error("Error fetching state:", err);
      return null;
    }
  }

  return (
    <>
      <EndpointDrawer
        wsEndpoint={wsEndpoint}
        setWsEndpoint={setWsEndpoint}
        savedEndpoints={savedEndpoints}
        setSavedEndpoints={setSavedEndpoints}
      />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <SearchBar />
        <GeneralInfoBar />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <LatestBlocks
              latestBlocks={latestBlocks}
              getRelativeTime={getRelativeTime}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LatestReports
              latestBlocks={latestBlocks}
              getRelativeTime={getRelativeTime}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
