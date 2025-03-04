"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import EndpointDrawer from "@/components/home/EndpointDrawer";
import SearchBar from "@/components/home/SearchBar";
import LatestBlocks from "@/components/home/lists/latest-list/LatestBlocks";
import LatestReports from "@/components/home/lists/latest-list/LatestReports";
import LatestExtrinsics from "@/components/home/lists/latest-list/LatestExtrinsics";
import { db, BlockRecord } from "@/db/db";
import { useWsRpc } from "@/hooks/home/useWsRpc";

const defaultWsUrl = "ws://localhost:9999/ws";

export default function HomePage() {
  // Local state (if needed for RPC results)
  const [block, setBlock] = useState<unknown>(null);
  const [state, setState] = useState<unknown>(null);

  // WebSocket endpoint management.
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);

  // Latest blocks loaded from IndexedDB.
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);

  // Current time for relative time calculation.
  const [now, setNow] = useState(Date.now());

  // Use our custom hook to handle all WebSocket/RPC interactions.
  useWsRpc({
    wsEndpoint,
    defaultWsUrl,
    onNewBlock: (blockRecord, stateRecord) => {
      setBlock(blockRecord.block);
      setState(stateRecord.state);
    },
    onUpdateNow: (timestamp) => {
      setNow(timestamp);
    },
    setSavedEndpoints,
  });

  // Load latest blocks from IndexedDB whenever a new block is saved.
  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort(
          (a, b) => b.overview.createdAt - a.overview.createdAt
        );
        setLatestBlocks(sorted);
      })
      .catch((error) => {
        console.error("Error loading blocks from DB:", error);
      });
  }, [block]);

  return (
    <Container sx={{ py: 5 }}>
      <EndpointDrawer
        wsEndpoint={wsEndpoint}
        setWsEndpoint={setWsEndpoint}
        savedEndpoints={savedEndpoints}
        setSavedEndpoints={setSavedEndpoints}
      />

      <Container maxWidth="lg">
        <SearchBar />

        <Grid container spacing={4}>
          {/* Left column: Latest Blocks (max 10) */}
          <Grid item xs={12} md={6}>
            <LatestBlocks latestBlocks={latestBlocks.slice(0, 12)} />
          </Grid>

          {/* Right column: Latest Extrinsics and Latest Reports */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <LatestExtrinsics latestBlocks={latestBlocks} />
              </Grid>
              <Grid item xs={12}>
                <LatestReports latestBlocks={latestBlocks} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
