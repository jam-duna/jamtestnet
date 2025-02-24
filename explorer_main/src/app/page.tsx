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
import { db, BlockRecord, StateRecord } from "../../db"; // Import Dexie database

const defaultRpcUrl = "http://localhost:9999/rpc";
const defaultWsUrl = "ws://localhost:9999/ws";

export default function HomePage() {
  // State to store fetched block and state data from RPC calls.
  const [block, setBlock] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  // State to manage WebSocket endpoint. Initially set to default.
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);

  // State to store saved endpoints from custom connections.
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);

  // State to hold latest blocks loaded from IndexedDB.
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);

  // Instead of ticking every second, we update `now` only when new blocks arrive.
  const [now, setNow] = useState(Date.now());

  // Helper function to compute relative time from a timestamp.
  function getRelativeTime(timestamp: number) {
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    if (secondsAgo < 0) return "0 seconds ago";
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  }

  // Effect: Create a new WebSocket whenever wsEndpoint changes.
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
          const fetchedBlock = await fetchBlock(headerHash);
          const fetchedState = await fetchState(headerHash);
          console.log("Fetched Block:", fetchedBlock);
          console.log("Fetched State:", fetchedState);
          setBlock(fetchedBlock);
          setState(fetchedState);

          // Save the whole fetchedBlock into IndexedDB.
          if (fetchedBlock && fetchedBlock.header) {
            const header = fetchedBlock.header;
            const blockRecord: BlockRecord = {
              blockHash: msg.result.blockHash, // full block hash
              headerHash: headerHash, // header hash
              slot: header.slot,
              rawData: fetchedBlock, // store the complete block data
              createdAt: Date.now(), // record the creation time
            };
            await db.blocks
              .put(blockRecord)
              .then((key) => {
                console.log("Block successfully saved with key:", key);
                console.log("Block with headerHash:", headerHash);
                console.log("Block with slot:", header.slot);
                // Update "now" when a new block comes in.
                setNow(Date.now());
              })
              .catch((error) => {
                console.error("Error saving block:", error);
              });
          } else {
            console.warn("No valid block header to save.");
          }

          // Save state data if fetchedState is an array.
          if (Array.isArray(fetchedState)) {
            for (const stateRecord of fetchedState) {
              const stateRec: StateRecord = {
                blockHash: fetchedBlock?.hash, // common identifier linking state to block
                rawData: stateRecord,
              };

              console.log(stateRec);

              await db.states
                .put(stateRec)
                .then((key) => {
                  console.log("State record successfully saved with key:", key);
                })
                .catch((error) => {
                  console.error("Error saving state record:", error);
                });
            }
          } else {
            console.warn("Fetched state is not an array; nothing to save.");
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [wsEndpoint]);

  // Effect: Load latest blocks from IndexedDB whenever a new block is saved.
  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort((a, b) => b.slot - a.slot);
        setLatestBlocks(sorted);
        console.log("Latest blocks loaded from DB:", sorted);
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

  // Example function to retrieve the state records for a given block based on blockHash.
  async function getStateForBlock(blockRecord: BlockRecord) {
    try {
      const stateRecords = await db.states
        .where("blockHash")
        .equals(blockRecord.blockHash)
        .toArray();
      console.log("State records for block:", stateRecords);
      return stateRecords;
    } catch (error) {
      console.error("Error retrieving state record:", error);
      return [];
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
        {/* 1. Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by address, tx hash, or block number..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 2. General Info Bar */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">ETH Price</Typography>
              <Typography variant="subtitle1">$2,800.00</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Gas Price</Typography>
              <Typography variant="subtitle1">80 Gwei</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">Network Status</Typography>
              <Typography variant="subtitle1" color="green">
                Healthy
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* 3. Latest Blocks (from IndexedDB) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Latest Blocks
              </Typography>
              {latestBlocks.map((blockItem) => (
                <Link
                  key={blockItem.id}
                  href={`/block/${blockItem.headerHash}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ mb: 2, cursor: "pointer" }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        Slot: {blockItem.slot} (
                        {blockItem.createdAt
                          ? getRelativeTime(blockItem.createdAt)
                          : "N/A"}
                        )
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Header Hash: {blockItem.headerHash}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Paper>
          </Grid>

          {/* 4. Latest Reports (from IndexedDB) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Latest Reports
              </Typography>
              {latestBlocks
                .filter((blockItem) => {
                  const raw = blockItem.rawData;
                  return (
                    raw &&
                    raw.extrinsic &&
                    Array.isArray(raw.extrinsic.guarantees) &&
                    raw.extrinsic.guarantees.length > 0
                  );
                })
                .map((blockItem) => {
                  const raw = blockItem.rawData;
                  const guaranteesCount = raw.extrinsic.guarantees.length;
                  const headerHash = blockItem.headerHash;
                  return (
                    <Link
                      key={blockItem.id}
                      href={`/block/${headerHash}/work-report`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card sx={{ mb: 2, cursor: "pointer" }}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            Work Report: {guaranteesCount} (
                            {blockItem.createdAt
                              ? getRelativeTime(blockItem.createdAt)
                              : "N/A"}
                            )
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Header Hash: {headerHash || "N/A"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
