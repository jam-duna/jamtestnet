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
import { db } from "../../db"; // Import Dexie database

const defaultRpcUrl = "http://localhost:9999/rpc";
const defaultWsUrl = "ws://localhost:9999/ws";

// Define TypeScript interfaces for our sample data (for UI display)
interface Block {
  id: number;
  hash: string;
  timestamp: string;
  transactions: number;
}

interface Transaction {
  id: number;
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

// Sample data for latest blocks and transactions (for UI display)
const sampleBlocks: Block[] = [
  {
    id: 16724371,
    hash: "0xabc123...",
    timestamp: "2025-02-19 10:00",
    transactions: 25,
  },
  {
    id: 16724370,
    hash: "0xdef456...",
    timestamp: "2025-02-19 09:55",
    transactions: 30,
  },
  {
    id: 16724369,
    hash: "0xghi789...",
    timestamp: "2025-02-19 09:50",
    transactions: 20,
  },
];

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
  // State to store fetched block and state data from RPC calls.
  const [block, setBlock] = useState<any>(null);
  const [state, setState] = useState<any>(null);

  // State to manage WebSocket endpoint. Initially set to default.
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);

  // State to store saved endpoints from successful custom connections.
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);

  // Effect that creates a new WebSocket whenever wsEndpoint changes.
  useEffect(() => {
    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      console.log("WebSocket connected to:", wsEndpoint);
      // If this is a custom endpoint (different from default) and not already saved, add it.
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

          // Save block data using properties from the 'header' object.
          if (fetchedBlock && fetchedBlock.header) {
            const header = fetchedBlock.header;
            await db.blocks
              .put({
                headerHash: header.extrinsic_hash,
                slot: header.slot,
                parent: header.parent,
                authorIndex: header.author_index,
                seal: header.seal,
                entropySource: header.entropy_source,
              })
              .then((key) => {
                console.log("Block successfully saved with key:", key);
              })
              .catch((error) => {
                console.error("Error saving block:", error);
              });
          } else {
            console.warn("No valid block header to save.");
          }
          // Save state data: fetchedState is expected to be an array.
          if (Array.isArray(fetchedState)) {
            for (const stateRecord of fetchedState) {
              await db.states
                .put({
                  bandersnatch: stateRecord.bandersnatch,
                  ed25519: stateRecord.ed25519,
                  bls: stateRecord.bls,
                  metadata: stateRecord.metadata,
                })
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
          {/* 3. Latest Blocks */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Latest Blocks
              </Typography>
              {sampleBlocks.map((blockItem) => (
                <Link
                  key={blockItem.id}
                  href={`/block/${blockItem.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card sx={{ mb: 2, cursor: "pointer" }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        Block #{blockItem.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Hash: {blockItem.hash}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Time: {blockItem.timestamp}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Transactions: {blockItem.transactions}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Paper>
          </Grid>

          {/* 4. Latest Transactions */}
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
