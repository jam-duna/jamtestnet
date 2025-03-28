"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Link as MuiLink, Box, Grid } from "@mui/material";
import { Block, State } from "@/db/db";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { filterBlocks, filterStates, filterWorkPackages, sortBlocks, sortStates } from "@/utils/blockAnalyzer";
import { GridData, parseBlocksToGridData } from "@/utils/parseBlocksToGridData";
import { BlockListGrid, CoreStatsGrid, RecentServices, RecentWorkPackages } from "@/components/core";
import { useWsRpc } from "@/hooks/home/useWsRpc";


export default function CoreDetailPage() {
  const params = useParams();
  const coreIndex = params.coreIndex as string;

  const [currentBlock, setCurrentBlock] = useState<unknown>(null);
  const [currentState, setCurrentState] = useState<unknown>(null);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [activeStates, setActiveStates] = useState<State[]>([]);
  const [gridData, setGridData] = useState<GridData>({
    data: {},
    timeslots: [],
    timestamps: [],
    cores: [],
    coreStatistics: {},
  });

  const [now, setNow] = useState(Date.now());
  const [savedEndpoints, setSavedEndpoints] = useState<string[]>([]);

  useWsRpc({
    wsEndpoint: DEFAULT_WS_URL,
    onNewBlock: (blockRecord, stateRecord) => {
      setCurrentBlock(blockRecord);
      setCurrentState(stateRecord);
    },
    onUpdateNow: setNow,
    setSavedEndpoints,
  });

  useEffect(() => {
    const fetchBlocks = async() => {
      const blocks = await filterBlocks(8);
      setFilteredBlocks(blocks);
    }
    const fetchStates = async() => {
      const states = await filterStates(8);
      setFilteredStates(states);
    }
    const fetchActiveStates = async() => {
      const states = await filterWorkPackages(Number.parseInt(coreIndex));
      setActiveStates(states);
    }
  
    fetchBlocks();
    fetchStates();
    fetchActiveStates();
  }, [currentBlock]);

  useEffect(() => {
    const data = parseBlocksToGridData(filteredBlocks, filteredStates);
    data.cores = [Number.parseInt(coreIndex)];
    setGridData(data);
    console.log(data);
  }, [filteredBlocks]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Core
        </Typography>
        <Typography variant="h6" sx={{ ml: 1.5, mt:0.5 }}>
          #{coreIndex}
        </Typography>
      </Box>

      <BlockListGrid
          timeslots={gridData.timeslots}
          timestamps={gridData.timestamps}
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

      <Grid sx={{ my: 5 }} container spacing={4}>
          <Grid item xs={12} md={6}>
            <RecentWorkPackages states={activeStates} coreIndex={Number.parseInt(coreIndex)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentServices states={activeStates} coreIndex={Number.parseInt(coreIndex)} />
          </Grid>
      </Grid>
      
    </Container>
  );
}
