"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Link as MuiLink, Box } from "@mui/material";
import { Block, State } from "@/db/db";
import { useFetchRpc } from "@/hooks/home/useFetchRpc";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { filterBlocks, filterStates, sortBlocks, sortStates } from "@/utils/blockAnalyzer";
import MainViewGrid, { SquareContent } from "@/components/home/MainViewGrid";
import { GridData, parseBlocksToGridData } from "@/utils/parseBlocksToGridData";
import { BlockListGrid, CoreStatsGrid } from "@/components/core";
import { useInsertMockDataIfEmpty } from "@/utils/debug";


export default function CoreDetailPage() {
  const params = useParams();
  const coreIndex = params.coreIndex as string;

  const [currentBlock, setCurrentBlock] = useState<unknown>(null);
  const [currentState, setCurrentState] = useState<unknown>(null);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [gridData, setGridData] = useState<GridData>({
    data: {},
    timeslots: [],
    cores: [],
    coreStatistics: {},
  });

  //useInsertMockDataIfEmpty();

  useFetchRpc({rpcUrl: DEFAULT_WS_URL, onNewBlock: (blockRecord, stateRecord) => {
    setCurrentBlock(blockRecord);
    setCurrentState(stateRecord);
  }});

  useEffect(() => {
    const fetchBlocks = async() => {
      const blocks = await filterBlocks(8);
      setFilteredBlocks(blocks);
    }
    const fetchStates = async() => {
      const states = await filterStates(8);
      setFilteredStates(states);
    }

    fetchBlocks();
    fetchStates();
  }, [currentBlock]);

  useEffect(() => {
    const data = parseBlocksToGridData(filteredBlocks, filteredStates);
    data.cores = [Number.parseInt(coreIndex)];
    setGridData(data);
  }, [filteredBlocks]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Core
        </Typography>
        <Typography variant="h6" sx={{ ml: 1.5, mt:0.5 }}>
          id {coreIndex}
        </Typography>
      </Box>
      <BlockListGrid
          timeslots={gridData.timeslots}
          coreIndex={Number.parseInt(coreIndex)}
          data={gridData.data}
        />
      { gridData.timeslots.length > 0 && 
        gridData.coreStatistics[Number.parseInt(coreIndex)] && 
        gridData.coreStatistics[Number.parseInt(coreIndex)][gridData.timeslots[0]] &&
        <CoreStatsGrid 
          stats={gridData.coreStatistics[Number.parseInt(coreIndex)][gridData.timeslots[0]]}
        />
      }
      
    </Container>
  );
}
