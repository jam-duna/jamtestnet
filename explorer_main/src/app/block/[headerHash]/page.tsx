"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Paper, Typography, Box } from "@mui/material";
import DetailToggleButtons from "@/components/details/DetailToggleButtons";
import { BlockTab } from "@/components/blockDetails/tabs/BlockTab";
import { StateTab } from "@/components/blockDetails/tabs/StateTab";
import { useBlockOverview } from "@/hooks/useBlockOverview";

export default function BlockOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const headerHash = params.headerHash as string;

  const { blockRecord, stateRecord, prevHash, nextHash } =
    useBlockOverview(headerHash);
  const [selectedTab, setSelectedTab] = useState<"block" | "state">("block");

  if (!blockRecord) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">Block Details</Typography>
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
          # {blockRecord.block.header.slot}
        </Typography>
      </Box>

      <DetailToggleButtons
        selectedTab={selectedTab}
        onTabChange={(tab) => setSelectedTab(tab)}
      />

      {selectedTab === "block" ? (
        <BlockTab
          blockRecord={blockRecord}
          headerHash={headerHash}
          prevHash={prevHash}
          nextHash={nextHash}
        />
      ) : (
        <StateTab stateRecord={stateRecord} />
      )}
    </Container>
  );
}
