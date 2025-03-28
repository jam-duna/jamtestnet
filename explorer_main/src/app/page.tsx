"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Grid, Button, Typography } from "@mui/material";
import EndpointDrawer from "@/components/home/EndpointDrawer";
import SearchBar from "@/components/home/SearchBar";
import LatestBlocks from "@/components/home/lists/latest-list/LatestBlocks";
import LatestReports from "@/components/home/lists/latest-list/LatestReports";
import LatestExtrinsics from "@/components/home/lists/latest-list/LatestExtrinsics";
import { db, Block, State } from "@/db/db";
import { useWsRpc } from "@/hooks/home/useWsRpc";
import MainViewGrid, { SquareContent } from "@/components/home/MainViewGrid";
import PiTable from "@/components/block/tables/PiTable";
import { DEFAULT_WS_URL } from "@/utils/helper";

interface GridData {
  data: Record<number, Record<number, SquareContent>>;
  timeslots: number[];
  cores: number[];
}

function parseBlocksToGridData(blocks: Block[]): GridData {
  const grid: Record<number, Record<number, SquareContent>> = {};
  const timeslots = new Set<number>();
  const cores = new Set<number>([0, 1]);

  blocks.forEach((block) => {
    const slot = block.overview?.slot;
    if (typeof slot !== "number") return;
    timeslots.add(slot);
    const headerHash = block.overview?.headerHash ?? "";
    const guarantees = block.extrinsic?.guarantees ?? [];
    const validGuarantees = guarantees.filter(
      (g) => typeof g.report.core_index === "number"
    );

    if (validGuarantees.length > 0) {
      validGuarantees.forEach((g) => {
        const coreIndex = g.report.core_index;
        cores.add(coreIndex);
        const serviceName: string = String(
          g.report.results?.[0]?.service_id || ""
        );
        const wpHash = g.report.package_spec?.hash ?? "";
        const finalHash = wpHash.trim() !== "" ? wpHash : "";
        grid[coreIndex] = {
          ...grid[coreIndex],
          [slot]: {
            serviceName,
            workPackageHash: finalHash,
            headerHash,
            isBusy: finalHash !== "",
          },
        };
      });
    } else {
      [0, 1].forEach((defaultCore) => {
        grid[defaultCore] = {
          ...grid[defaultCore],
          [slot]: {
            serviceName: "",
            workPackageHash: "",
            headerHash: "",
            isBusy: false,
          },
        };
      });
    }
  });

  timeslots.forEach((slot) => {
    cores.forEach((coreIndex) => {
      grid[coreIndex] = grid[coreIndex] || {};
      if (!grid[coreIndex][slot]) {
        grid[coreIndex][slot] = {
          serviceName: "",
          workPackageHash: "",
          headerHash: "",
          isBusy: false,
        };
      }
    });
  });

  return {
    data: grid,
    timeslots: Array.from(timeslots).sort((a, b) => b - a),
    cores: Array.from(cores).sort((a, b) => a - b),
  };
}

export default function HomePage() {
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [currentState, setCurrentState] = useState<State | null>(null);
  const [wsEndpoint, setWsEndpoint] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("customWsEndpoint") || DEFAULT_WS_URL;
    }
    return DEFAULT_WS_URL;
  });
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestStates, setLatestStates] = useState<State[]>([]);
  const [now, setNow] = useState(Date.now());
  const [gridData, setGridData] = useState<GridData>({
    data: {},
    timeslots: [],
    cores: [],
  });
  const [showOnlyWorkPackages, setShowOnlyWorkPackages] = useState(false);

  // useInsertMockDataIfEmpty();

  useWsRpc({
    wsEndpoint,
    onNewBlock: (blockRecord, stateRecord) => {
      setCurrentBlock(blockRecord);
      setCurrentState(stateRecord);
    },
    onUpdateNow: setNow,
    setSavedEndpoints,
  });

  //useInsertMockDataIfEmpty();

  useEffect(() => {
    // Load blocks from DB.
    db.blocks
      .toArray()
      .then((blocks) => {
        const sortedBlocks = blocks.sort((a, b) => {
          const aCreatedAt = a?.overview?.createdAt;
          const bCreatedAt = b?.overview?.createdAt;
          if (aCreatedAt == null && bCreatedAt == null) return 0;
          if (aCreatedAt == null) return 1;
          if (bCreatedAt == null) return -1;
          return bCreatedAt - aCreatedAt;
        });
        setLatestBlocks(sortedBlocks);
      })
      .catch((error) => {
        console.error("Error loading blocks from DB:", error);
      });

    // Load states from DB.
    db.states
      .toArray()
      .then((states) => {
        const sortedStates = states.sort((a, b) => {
          const aCreatedAt = a?.overview?.createdAt;
          const bCreatedAt = b?.overview?.createdAt;
          if (aCreatedAt == null && bCreatedAt == null) return 0;
          if (aCreatedAt == null) return 1;
          if (bCreatedAt == null) return -1;
          return bCreatedAt - aCreatedAt;
        });
        setLatestStates(sortedStates);
      })
      .catch((error) => {
        console.error("Error loading states from DB:", error);
      });
  }, [currentBlock]);

  const filteredBlocks = useMemo(() => {
    return showOnlyWorkPackages
      ? latestBlocks
          .filter((block) => {
            const guarantees = block.extrinsic?.guarantees ?? [];
            return guarantees.some((g) => {
              const wpHash = g.report.package_spec?.hash;
              return wpHash && wpHash.trim() !== "";
            });
          })
          .slice(0, 8)
      : latestBlocks.slice(0, 8);
  }, [latestBlocks, showOnlyWorkPackages]);

  useEffect(() => {
    setGridData(parseBlocksToGridData(filteredBlocks));
  }, [filteredBlocks]);

  // Assume the PI data is stored on the "pi" property of the first state object.
  const piData = latestStates.length > 0 ? latestStates[0].pi : undefined;

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

        <Typography variant="h4" sx={{ mb: 3 }}>
          Home Page
        </Typography>

        <Button
          variant="outlined"
          onClick={() => setShowOnlyWorkPackages((prev) => !prev)}
          sx={{ mb: 2 }}
        >
          {showOnlyWorkPackages ? "Show All Blocks" : "Show Active Blocks"}
        </Button>
        <MainViewGrid
          timeslots={gridData.timeslots}
          cores={gridData.cores}
          data={gridData.data}
        />

        {/* {piData && <PiTable data={piData} isHomePage={true} />} */}

        <Grid sx={{ my: 5 }} container spacing={4}>
          <Grid item xs={12} md={6}>
            <LatestBlocks latestBlocks={latestBlocks.slice(0, 12)} />
          </Grid>
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
