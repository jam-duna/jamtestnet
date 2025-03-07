// src/components/WorkReportListItem.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Block } from "@/db/db";
import { truncateHash, getRelativeTime, pluralize } from "@/utils/helper";

export interface WorkReportListItemProps {
  blockItem: Block;
}

export default function WorkReportListItem({
  blockItem,
}: WorkReportListItemProps) {
  const guaranteesCount = blockItem.extrinsic.guarantees.length;
  const createdAt = blockItem?.overview?.createdAt;
  const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";
  const headerHash = blockItem?.overview?.headerHash || "";
  const shortHash = truncateHash(headerHash);
  const slot = blockItem.header.slot;

  return (
    <Link
      key={headerHash}
      href={`/block/${headerHash}/work-report`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          borderRadius: 1,
          transition: "background-color 0.2s",
          "&:hover": { backgroundColor: "#f9f9f9" },
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
            Slot {slot} - {guaranteesCount}
            {pluralize(" Report", guaranteesCount)}
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
}
