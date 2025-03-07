"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Container, Paper, Typography, Box } from "@mui/material";
import DetailToggleButtons from "@/components/block/DetailToggleButtons";
import { BlockTab } from "@/components/block/tabs/BlockTab";
import { StateTab } from "@/components/block/tabs/StateTab";
import { useBlockOverview } from "@/hooks/useBlockOverview";

export default function BlockOverviewPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;
  const searchParams = useSearchParams();
  const hashType = searchParams.get("type") as string;

  console.log(headerHash, hashType);
  const { blockRecord, stateRecord, prevHash, nextHash } = useBlockOverview(
    headerHash,
    hashType
  );

  console.log(hashType);

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

      {selectedTab === "block" ? (
        <BlockTab
          blockRecord={blockRecord}
          hash={headerHash}
          type={hashType}
          prevHash={prevHash}
          nextHash={nextHash}
        />
      ) : (
        <StateTab stateRecord={stateRecord} />
      )}
    </Container>
  );
}
