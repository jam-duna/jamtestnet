"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Typography, Paper, Card, CardContent } from "@mui/material";
import { db, BlockRecord, StateRecord } from "../../../db";

type LatestBlocksProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

export default function LatestBlocks({
  latestBlocks,
  getRelativeTime,
}: LatestBlocksProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Latest Blocks
      </Typography>
      {latestBlocks.map((blockItem) => (
        <Link
          key={blockItem.headerHash}
          href={`/block/${blockItem.headerHash}`}
          style={{ textDecoration: "none" }}
        >
          <Card sx={{ mb: 2, cursor: "pointer" }}>
            <CardContent>
              <Typography variant="subtitle1">
                Slot: {blockItem.block.header.slot} (
                {blockItem.overview.createdAt
                  ? getRelativeTime(blockItem.overview.createdAt)
                  : "N/A"}
                )
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Header Hash: {blockItem.headerHash}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Paper>
  );
}
