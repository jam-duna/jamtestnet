"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment"; // Report icon
import { BlockRecord } from "../../../db";

type LatestReportsProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

// Helper to truncate a hash: shows first 8 hex chars and last 8.
function truncateHash(hash: string): string {
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;
  if (clean.length <= 16) return "0x" + clean;
  const prefix = clean.slice(0, 8);
  const suffix = clean.slice(-8);
  return `0x${prefix}...${suffix}`;
}

export default function LatestReports({
  latestBlocks,
  getRelativeTime,
}: LatestReportsProps) {
  // Filter blocks with at least one report (guarantee)
  const filteredBlocks = latestBlocks
    .filter((blockItem) => {
      const extrinsic = blockItem.block.extrinsic;
      return (
        extrinsic &&
        Array.isArray(extrinsic.guarantees) &&
        extrinsic.guarantees.length > 0
      );
    })
    .slice(0, 5);

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
        const guaranteesCount = blockItem.block.extrinsic.guarantees.length;
        const createdAt = blockItem.overview.createdAt;
        const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";
        const shortHash = truncateHash(blockItem.headerHash);

        return (
          <Link
            key={blockItem.headerHash}
            href={`/block/${blockItem.headerHash}/work-report`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                borderRadius: 1,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                },
                borderBottom: "1px solid #ddd",
              }}
            >
              {/* Left icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  mr: 2,
                }}
              >
                <AssignmentIcon fontSize="small" />
              </Box>

              {/* Middle: Report count and relative time */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {guaranteesCount} Report{guaranteesCount > 1 ? "s" : ""}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {relativeTime} ago
                </Typography>
              </Box>

              {/* Right: truncated header hash */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  {shortHash}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  header hash
                </Typography>
              </Box>
            </Box>
          </Link>
        );
      })}
      <Link
        href={`/report-list`}
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
