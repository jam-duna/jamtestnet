"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";

export interface DetailToggleButtonsProps {
  selectedTab: "block" | "state";
  onTabChange: (tab: "block" | "state") => void;
}

export default function DetailToggleButtons({
  selectedTab,
  onTabChange,
}: DetailToggleButtonsProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant={selectedTab === "block" ? "contained" : "outlined"}
        onClick={() => onTabChange("block")}
        sx={{ mr: 1 }}
      >
        <Typography variant="caption" fontWeight={600}>
          Block
        </Typography>
      </Button>
      <Button
        variant={selectedTab === "state" ? "contained" : "outlined"}
        onClick={() => onTabChange("state")}
      >
        <Typography variant="caption" fontWeight={600}>
          State
        </Typography>
      </Button>
    </Box>
  );
}
