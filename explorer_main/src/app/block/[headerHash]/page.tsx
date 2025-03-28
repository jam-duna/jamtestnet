"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Container, Paper, Typography, Box } from "@mui/material";
import DetailToggleButtons from "@/components/block/DetailToggleButtons";
import { BlockTab } from "@/components/block/tabs/BlockTab";
import { StateTab } from "@/components/block/tabs/StateTab";
import { useBlockOverview } from "@/hooks/useBlockOverview";

export default function BlockOverviewPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type") as "hash" | "slot";

  const { blockRecord, stateRecord, prevHash, nextHash } = useBlockOverview(
    headerHash,
    queryType
  );

  const [selectedTab, setSelectedTab] = useState<"block" | "state">("block");

  if (!blockRecord) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Block Details
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body1">Loading block details...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Block
        </Typography>
        <Typography variant="body1" sx={{ ml: 1.5 }}>
          # {blockRecord.header.slot}
        </Typography>
      </Box>

      <DetailToggleButtons
        selectedTab={selectedTab}
        onTabChange={(tab) => setSelectedTab(tab)}
      />

      {selectedTab === "block" && (
        <BlockTab
          blockRecord={blockRecord}
          hash={headerHash}
          type={queryType}
          prevHash={prevHash}
          nextHash={nextHash}
        />
      )}

      {selectedTab === "state" && stateRecord && (
        <StateTab stateRecord={stateRecord} />
      )}

      {selectedTab === "state" && !stateRecord && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2">No state data available.</Typography>
        </Paper>
      )}
    </Container>
  );
}
