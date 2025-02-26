"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare"; // Example icon
import { BlockRecord } from "../../../db";

type LatestBlocksProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

// Helper to truncate the hash to 4 bytes at the start and 4 bytes at the end.
// For example: 0x1234ABCD...7890EF12
function truncateHash(hash: string): string {
  // Ensure we have a leading "0x"
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;
  // We'll take 8 hex chars (4 bytes) at the start and 8 at the end
  if (clean.length <= 16) {
    // If it's too short, just return it
    return "0x" + clean;
  }
  const prefix = clean.slice(0, 8);
  const suffix = clean.slice(-8);
  return `0x${prefix}...${suffix}`;
}

export default function LatestBlocks({
  latestBlocks,
  getRelativeTime,
}: LatestBlocksProps) {
  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Latest Blocks
      </Typography>

      {latestBlocks.map((blockItem) => {
        const slot = blockItem.block.header.slot;
        const createdAt = blockItem.overview.createdAt;
        const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";

        // Truncate the block hash
        const shortHash = truncateHash(blockItem.headerHash);

        return (
          <Link
            key={blockItem.headerHash}
            href={`/block/${blockItem.headerHash}`}
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
                {/* Example: 184 txns in 12 secs or any other info you want */}
                <Typography variant="body2" color="textSecondary">
                  header hash
                </Typography>
              </Box>
            </Box>
          </Link>
        );
      })}
      <Link
        href={`/block-list`}
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
          View All Blocks
        </Typography>
      </Link>
    </Paper>
  );
}
