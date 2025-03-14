"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Grid, Button } from "@mui/material";
import EndpointDrawer from "@/components/home/EndpointDrawer";
import SearchBar from "@/components/home/SearchBar";
import LatestBlocks from "@/components/home/lists/latest-list/LatestBlocks";
import LatestReports from "@/components/home/lists/latest-list/LatestReports";
import LatestExtrinsics from "@/components/home/lists/latest-list/LatestExtrinsics";
import { db, Block } from "@/db/db";
import { useWsRpc } from "@/hooks/home/useWsRpc";
import MainViewGrid, { SquareContent } from "@/components/home/MainViewGrid";

const defaultWsUrl = "ws://localhost:9999/ws";

interface GridData {
  data: Record<number, Record<number, SquareContent>>;
  timeslots: number[];
  cores: number[];
}

function parseBlocksToGridData(blocks: Block[]): GridData {
  const data: Record<number, Record<number, SquareContent>> = {};
  const timeslots = new Set<number>();
  const cores = new Set<number>();

  // Ensure default cores 0 and 1 are always included
  cores.add(0);
  cores.add(1);

  for (const block of blocks) {
    const slot = block.overview?.slot;
    if (typeof slot !== "number") continue;
    timeslots.add(slot);

    const guarantees = block.extrinsic?.guarantees ?? [];
    let processedAny = false;

    // Process guarantees that have a valid coreIndex.
    for (const g of guarantees) {
      const coreIndex = g.report.core_index;
      if (typeof coreIndex === "number") {
        cores.add(coreIndex);

        const firstResult = g.report.results?.[0];
        let serviceName = "";
        if (firstResult) {
          serviceName = `svc-${firstResult.service_id}`;
        }
        const wpHash = g.report.package_spec?.hash;
        const finalHash =
          wpHash && wpHash.trim() !== "" ? wpHash : "No Work Package";

        if (!data[coreIndex]) data[coreIndex] = {};
        data[coreIndex][slot] = {
          serviceName,
          workPackageHash: finalHash,
          isBusy: Boolean(wpHash && wpHash.trim() !== ""),
        };
        processedAny = true;
      }
    }

    // If no guarantee with a valid coreIndex was processed for this block,
    // add default entries for default cores 0 and 1.
    if (!processedAny) {
      [0, 1].forEach((coreIndex) => {
        if (!data[coreIndex]) data[coreIndex] = {};
        data[coreIndex][slot] = {
          serviceName: "",
          workPackageHash: "No Work Package",
          isBusy: false,
        };
      });
    }
  }

  // Fill missing cells with default values.
  for (const c of cores) {
    for (const t of timeslots) {
      if (!data[c]) data[c] = {};
      if (!data[c][t]) {
        data[c][t] = {
          serviceName: "",
          workPackageHash: "No Work Package",
          isBusy: false,
        };
      }
    }
  }

  return {
    data,
    timeslots: Array.from(timeslots).sort((a, b) => b - a),
    cores: Array.from(cores).sort((a, b) => a - b),
  };
}

export default function HomePage() {
  const [block, setBlock] = useState<unknown>(null);
  const [wsEndpoint, setWsEndpoint] = useState<string>(defaultWsUrl);
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [now, setNow] = useState(Date.now());
  const [gridData, setGridData] = useState<GridData>({
    data: {},
    timeslots: [],
    cores: [],
  });
  const [showOnlyWorkPackages, setShowOnlyWorkPackages] = useState(false);

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

  // Compute the blocks to use based on the toggle.
  const blocksToUse = useMemo(() => {
    if (showOnlyWorkPackages) {
      // Filter blocks that have at least one guarantee with a non-empty package_spec.hash.
      return latestBlocks
        .filter((block) => {
          const guarantees = block.extrinsic?.guarantees ?? [];
          return guarantees.some((g) => {
            const wpHash = g.report.package_spec?.hash;
            return wpHash && wpHash.trim() !== "";
          });
        })
        .slice(0, 8);
    } else {
      return latestBlocks.slice(0, 8);
    }
  }, [latestBlocks, showOnlyWorkPackages]);

  // Parse the blocks into grid data.
  useEffect(() => {
    const parsed = parseBlocksToGridData(blocksToUse);
    setGridData(parsed);
  }, [blocksToUse]);

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
        {/* Toggle Button */}
        <Button
          variant="outlined"
          onClick={() => setShowOnlyWorkPackages((prev) => !prev)}
          sx={{ mb: 2 }}
        >
          {showOnlyWorkPackages ? "Show All Blocks" : "Show Active Blocks"}
        </Button>
        {/* Grid view at the top */}
        <MainViewGrid
          timeslots={gridData.timeslots}
          cores={gridData.cores}
          data={gridData.data}
        />

        <Grid container spacing={4}>
          {/* Left column: Latest Blocks */}
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
