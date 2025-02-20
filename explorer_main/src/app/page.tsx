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

interface Transaction {
  id: number;
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    hash: "0xtx123...",
    from: "0xabc...",
    to: "0xdef...",
    amount: "1.5 ETH",
    timestamp: "2025-02-19 10:05",
  },
  {
    id: 2,
    hash: "0xtx456...",
    from: "0xghi...",
    to: "0xjkl...",
    amount: "0.8 ETH",
    timestamp: "2025-02-19 10:03",
  },
  {
    id: 3,
    hash: "0xtx789...",
    from: "0xmno...",
    to: "0xpqr...",
    amount: "2.0 ETH",
    timestamp: "2025-02-19 10:00",
  },
];

export default function HomePage() {
  const [block, setBlock] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);

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
          const { headerHash, blockHash } = msg.result;
          console.log(msg.result);

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
              blockHash: blockHash, // full block hash
              headerHash: headerHash, // header hash
              slot: header.slot,
              rawData: fetchedBlock, // store the complete block data
            };
            await db.blocks
              .put(blockRecord)
              .then((key) => {
                console.log("Block successfully saved with key:", key);
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
                blockHash: blockHash, // Link state to the block via blockHash
                rawData: stateRecord,
              };
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
                Latest Blocks (IndexedDB)
              </Typography>
              {latestBlocks.map((blockItem) => (
                <Link
                  key={blockItem.id}
                  href={`/block/${blockItem.blockHash}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ mb: 2, cursor: "pointer" }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        Slot: {blockItem.slot}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Block Hash: {blockItem.blockHash}
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

          {/* 4. Latest Transactions (sample data) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Latest Transactions
              </Typography>
              {sampleTransactions.map((tx) => (
                <Card key={tx.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Link
                      href={`/transaction/${tx.hash}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ cursor: "pointer" }}
                      >
                        Tx Hash: {tx.hash}
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">
                      From: {tx.from}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      To: {tx.to}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amount: {tx.amount}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time: {tx.timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
