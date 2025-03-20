"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface StatsData {
  blocks: number;
  tickets: number;
  pre_images: number;
  pre_images_size: number;
  guarantees: number;
  assurances: number;
}

interface DataObject {
  current: StatsData[];
  last: StatsData[];
}

const sampleData: DataObject = {
  current: [
    {
      blocks: 0,
      tickets: 0,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 1,
      assurances: 2,
    },
    {
      blocks: 1,
      tickets: 0,
      pre_images: 1,
      pre_images_size: 1175,
      guarantees: 2,
      assurances: 2,
    },
    {
      blocks: 2,
      tickets: 3,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 2,
      assurances: 2,
    },
    {
      blocks: 2,
      tickets: 3,
      pre_images: 1,
      pre_images_size: 1041,
      guarantees: 1,
      assurances: 2,
    },
    {
      blocks: 1,
      tickets: 3,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 1,
      assurances: 2,
    },
    {
      blocks: 2,
      tickets: 3,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 2,
      assurances: 2,
    },
  ],
  last: [
    {
      blocks: 3,
      tickets: 3,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 1,
      assurances: 3,
    },
    {
      blocks: 2,
      tickets: 0,
      pre_images: 2,
      pre_images_size: 2245,
      guarantees: 2,
      assurances: 3,
    },
    {
      blocks: 0,
      tickets: 0,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 2,
      assurances: 3,
    },
    {
      blocks: 0,
      tickets: 0,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 2,
      assurances: 3,
    },
    {
      blocks: 6,
      tickets: 6,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 1,
      assurances: 3,
    },
    {
      blocks: 1,
      tickets: 3,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 1,
      assurances: 3,
    },
  ],
};

function sumStats(data: StatsData[]): StatsData {
  return data.reduce(
    (acc, curr) => ({
      blocks: acc.blocks + curr.blocks,
      tickets: acc.tickets + curr.tickets,
      pre_images: acc.pre_images + curr.pre_images,
      pre_images_size: acc.pre_images_size + curr.pre_images_size,
      guarantees: acc.guarantees + curr.guarantees,
      assurances: acc.assurances + curr.assurances,
    }),
    {
      blocks: 0,
      tickets: 0,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 0,
      assurances: 0,
    }
  );
}

export default function StatisticsAnalysis() {
  const [openDialog, setOpenDialog] = useState(false);

  const currentTotals = sumStats(sampleData.current);
  const lastTotals = sumStats(sampleData.last);

  // Compute differences: current - last.
  const diff = {
    blocks: currentTotals.blocks - lastTotals.blocks,
    tickets: currentTotals.tickets - lastTotals.tickets,
    pre_images: currentTotals.pre_images - lastTotals.pre_images,
    pre_images_size: currentTotals.pre_images_size - lastTotals.pre_images_size,
    guarantees: currentTotals.guarantees - lastTotals.guarantees,
    assurances: currentTotals.assurances - lastTotals.assurances,
  };

  // Helper to format difference (prepend '+' if positive)
  const formatDiff = (value: number) => (value > 0 ? `+${value}` : `${value}`);

  return (
    <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Validator Statistics - Current Totals (vs Last)
      </Typography>
      <Typography>Blocks: {currentTotals.blocks}</Typography>
      <Typography>Tickets: {currentTotals.tickets}</Typography>
      <Typography>Pre Images: {currentTotals.pre_images}</Typography>
      <Typography>Pre Images Size: {currentTotals.pre_images_size}</Typography>
      <Typography>Guarantees: {currentTotals.guarantees}</Typography>
      <Typography>Assurances: {currentTotals.assurances}</Typography>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        See Detailed Difference
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Difference Analysis (Current vs Last)</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Blocks: Current {currentTotals.blocks} vs Last {lastTotals.blocks} (
            {formatDiff(diff.blocks)})
          </Typography>
          <Typography>
            Tickets: Current {currentTotals.tickets} vs Last{" "}
            {lastTotals.tickets} ({formatDiff(diff.tickets)})
          </Typography>
          <Typography>
            Pre Images: Current {currentTotals.pre_images} vs Last{" "}
            {lastTotals.pre_images} ({formatDiff(diff.pre_images)})
          </Typography>
          <Typography>
            Pre Images Size: Current {currentTotals.pre_images_size} vs Last{" "}
            {lastTotals.pre_images_size} ({formatDiff(diff.pre_images_size)})
          </Typography>
          <Typography>
            Guarantees: Current {currentTotals.guarantees} vs Last{" "}
            {lastTotals.guarantees} ({formatDiff(diff.guarantees)})
          </Typography>
          <Typography>
            Assurances: Current {currentTotals.assurances} vs Last{" "}
            {lastTotals.assurances} ({formatDiff(diff.assurances)})
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
