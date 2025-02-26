"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Typography, Paper, Card, CardContent } from "@mui/material";
import { db, BlockRecord, StateRecord } from "../../../db";

type LatestReportsProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

export default function LatestReports({
  latestBlocks,
  getRelativeTime,
}: LatestReportsProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Latest Reports
      </Typography>
      {latestBlocks
        .filter((blockItem) => {
          const raw = blockItem.block;
          return (
            raw &&
            raw.extrinsic &&
            Array.isArray(raw.extrinsic.guarantees) &&
            raw.extrinsic.guarantees.length > 0
          );
        })
        .slice(0, 5)
        .map((blockItem) => {
          const raw = blockItem.block;
          const guaranteesCount = raw.extrinsic.guarantees.length;
          const headerHash = blockItem.headerHash;
          return (
            <Link
              key={headerHash}
              href={`/block/${headerHash}/work-report`}
              style={{ textDecoration: "none" }}
            >
              <Card sx={{ mb: 2, cursor: "pointer" }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    Work Report: {guaranteesCount} (
                    {blockItem.overview.createdAt
                      ? getRelativeTime(blockItem.overview.createdAt)
                      : "N/A"}
                    )
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Header Hash: {headerHash || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          );
        })}
    </Paper>
  );
}
