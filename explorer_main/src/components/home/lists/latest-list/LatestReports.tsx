"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material"; // Report icon
import { BlockRecord } from "../../../../../db";
import { filterWorkReportBlocks } from "@/utils/extrinsics";
import WorkReportListItem from "@/components/home/lists/list-item/WorkReportListItem";

type LatestReportsProps = {
  latestBlocks: BlockRecord[];
};

export default function LatestReports({ latestBlocks }: LatestReportsProps) {
  const filteredBlocks = filterWorkReportBlocks(latestBlocks).slice(0, 5);

  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 2, px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Latest Work Reports
      </Typography>

      {filteredBlocks.map((blockItem) => {
        return (
          <WorkReportListItem
            key={blockItem.headerHash}
            blockItem={blockItem}
          />
        );
      })}

      <Link
        href={`/list/workReport`}
        style={{
          textDecoration: "none",
          color: "inherit",
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
        >
          View All Reports
        </Typography>
      </Link>
    </Paper>
  );
}
