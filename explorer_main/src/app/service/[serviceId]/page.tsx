"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Link as MuiLink,
  Box,
  Grid,
} from "@mui/material";
import { fetchService } from "@/hooks/service";
import { DEFAULT_WS_URL } from "@/utils/helper";
import { ServiceInfo, ServiceStatistics } from "@/types";
import {
  BlockListGrid,
  RecentPreimages,
  RecentWorkPackages,
  ServiceInfoTable,
  ServiceStatsGrid,
} from "@/components/service";
import { Block, State } from "@/db/db";
import { GridData, parseBlocksToGridData } from "@/utils/parseBlocksToGridData";
import {
  fetchServiceStatisticsFromId,
  filterBlocks,
  filterPreimagesFromService,
  filterStates,
  filterWorkPackagesFromService,
  PreimageProps,
} from "@/utils/blockAnalyzer";
import { getRpcUrlFromWs } from "@/utils/ws";
import { useWsRpc } from "@/hooks/home/useWsRpc";
export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [currentBlock, setCurrentBlock] = useState<unknown>(null);
  const [currentState, setCurrentState] = useState<unknown>(null);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [activeStates, setActiveStates] = useState<State[]>([]);
  const [recentPreimages, setRecentPreimages] = useState<PreimageProps[]>([]);
  const [serviceStatistics, setServiceStatistics] =
    useState<ServiceStatistics | null>(null);
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
    const fetchBlocks = async () => {
      const blocks = await filterBlocks(8);
      setFilteredBlocks(blocks);
    };
    const fetchStates = async () => {
      const states = await filterStates(8);
      setFilteredStates(states);
    };
    const fetchActiveStates = async () => {
      const states = await filterWorkPackagesFromService(
        Number.parseInt(serviceId)
      );
      setActiveStates(states);
    };
    const fetchRecentPreimages = async () => {
      const preimages = await filterPreimagesFromService(
        Number.parseInt(serviceId)
      );
      setRecentPreimages(preimages);
    };
    const fetchServiceStatistics = async () => {
      const data = await fetchServiceStatisticsFromId(
        Number.parseInt(serviceId)
      );
      setServiceStatistics(data);
    };

    fetchBlocks();
    fetchStates();
    fetchActiveStates();
    fetchRecentPreimages();
    fetchServiceStatistics();
  }, [currentBlock]);

  useEffect(() => {
    const data = parseBlocksToGridData(filteredBlocks, filteredStates);
    setGridData(data);
  }, [filteredBlocks]);

  useEffect(() => {
    if (serviceId) {
      (async () => {
        const info = await fetchService(
          serviceId,
          getRpcUrlFromWs(DEFAULT_WS_URL)
        );
        setServiceInfo(info);
      })();
    }
  }, [serviceId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Service
        </Typography>
        <Typography variant="h6" sx={{ ml: 1.5, mt: 0.5 }}>
          #{serviceId}
        </Typography>
      </Box>

      {!serviceInfo ? (
        <Paper variant="outlined" sx={{ p: 3, marginBlock: 3 }}>
          <Typography variant="h6">Loading service info...</Typography>
        </Paper>
      ) : (
        <ServiceInfoTable serviceInfo={serviceInfo}></ServiceInfoTable>
      )}

      <Box
        sx={{ display: "inline-flex", alignItems: "center", marginBlock: 3 }}
      >
        <BlockListGrid
          timeslots={gridData.timeslots}
          timestamps={gridData.timestamps}
          cores={gridData.cores}
          data={gridData.data}
          serviceId={serviceId}
        />
      </Box>

      {serviceStatistics ? (
        <ServiceStatsGrid stats={serviceStatistics} />
      ) : (
        <Typography variant="h6">Loading service stats...</Typography>
      )}

      <Grid sx={{ my: 5 }} container spacing={4}>
        <Grid item xs={12} md={6}>
          <RecentWorkPackages
            states={activeStates}
            serviceId={Number.parseInt(serviceId)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentPreimages preimages={recentPreimages} />
        </Grid>
      </Grid>
    </Container>
  );
}
