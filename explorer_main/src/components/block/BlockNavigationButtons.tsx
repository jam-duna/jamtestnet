"use client";

import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export interface BlockNavigationButtonsProps {
  slot: number;
  prevHash: string | null;
  nextHash: string | null;
  onPrev: () => void;
  onNext: () => void;
}

export default function BlockNavigationButtons({
  slot,
  prevHash,
  nextHash,
  onPrev,
  onNext,
}: BlockNavigationButtonsProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="body2">{slot}</Typography>
      <IconButton
        size="small"
        disabled={!prevHash}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        sx={{ ml: 1 }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        disabled={!nextHash}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        sx={{ ml: 0.5 }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
