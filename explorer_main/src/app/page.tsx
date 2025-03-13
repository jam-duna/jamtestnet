"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import EndpointDrawer from "@/components/home/EndpointDrawer";
import SearchBar from "@/components/home/SearchBar";
import LatestBlocks from "@/components/home/lists/latest-list/LatestBlocks";
import LatestReports from "@/components/home/lists/latest-list/LatestReports";
import LatestExtrinsics from "@/components/home/lists/latest-list/LatestExtrinsics";
import LatestServices from "@/components/home/lists/latest-list/LatestServices";
import { db, Block } from "@/db/db";
import { useWsRpc } from "@/hooks/home/useWsRpc";

const defaultWsUrl = "ws://localhost:9999/ws";

export default function HomePage() {
  const [block, setBlock] = useState<unknown>(null);
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [now, setNow] = useState(Date.now());

  // WebSocket/RPC hook.
  useWsRpc({
    wsEndpoint,
    defaultWsUrl,
    onNewBlock: (blockRecord, stateRecord) => {
      setBlock(blockRecord);
    },
    onUpdateNow: (timestamp) => {
      setNow(timestamp);
    },
    setSavedEndpoints,
  });

  // Load latest blocks from IndexedDB whenever a new block arrives.
  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort((a, b) => {
          const aCreatedAt = a?.overview?.createdAt;
          const bCreatedAt = b?.overview?.createdAt;
          if (aCreatedAt == null && bCreatedAt == null) return 0;
          if (aCreatedAt == null) return 1;
          if (bCreatedAt == null) return -1;
          return bCreatedAt - aCreatedAt;
        });
        setLatestBlocks(sorted);
      })
      .catch((error) => {
        console.error("Error loading blocks from DB:", error);
      });
  }, [block]);

  useEffect(() => {
    db.states
      .toArray()
      .then((states) => {
        console.log("All states from DB:", states);
      })
      .catch((error) => {
        console.error("Error loading states from DB:", error);
      });
  }, []);

  {
    /*
    // Create mock data for latest services.
  const mockLatestServices = [
    {
      code_hash:
        "0xbd87fb6de829abf2bb25a15b82618432c94e82848d9dd204f5d775d4b880ae0d",
      balance: 10000000000,
      min_item_gas: 100,
      min_memo_gas: 100,
      bytes: 1157,
      items: 4,
    },
    {
      code_hash: "0xabcdef",
      balance: 5000000000,
      min_item_gas: 150,
      min_memo_gas: 150,
      bytes: 500,
      items: 3,
    },
  ];
    */
  }

  return (
    <Container sx={{ py: 5 }}>
      <EndpointDrawer
        wsEndpoint={wsEndpoint}
        setWsEndpoint={setWsEndpoint}
        savedEndpoints={savedEndpoints}
        setSavedEndpoints={setSavedEndpoints}
      />
      <Container maxWidth="lg">
        <SearchBar wsEndpoint={wsEndpoint} />
        <Grid container spacing={4}>
          {/* Left column: Latest Blocks and Latest Services */}
          <Grid item xs={12} md={6}>
            <Grid item xs={12}>
              <LatestBlocks latestBlocks={latestBlocks.slice(0, 12)} />
            </Grid>
            {/* <Grid item xs={12}>
              <LatestServices latestServices={mockLatestServices} />
            </Grid> */}
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
