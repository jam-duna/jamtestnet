// src/components/BlockListItem.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { BlockRecord } from "@/db/db";
import { truncateHash, getRelativeTime } from "@/utils/helper";

export interface BlockListItemProps {
  blockItem: BlockRecord;
}

export default function BlockListItem({ blockItem }: BlockListItemProps) {
  const slot = blockItem.block.header.slot;
  const createdAt = blockItem.overview.createdAt;
  const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";
  const shortHash = truncateHash(blockItem.headerHash);

  return (
    <Link
      key={blockItem.headerHash}
      href={`/block/${blockItem.headerHash}/?type=headerHash`}
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
          <CropSquareIcon fontSize="small" />
        </Box>

        {/* Middle: Slot info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">Slot {slot}</Typography>
          <Typography variant="body2" color="textSecondary">
            {relativeTime} ago
          </Typography>
        </Box>

        {/* Right: truncated block hash */}
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
