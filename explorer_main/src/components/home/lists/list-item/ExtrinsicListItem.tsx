// src/components/ExtrinsicListItem.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Block } from "@/db/db";
import { calculateExtrinsicCounts } from "@/utils/extrinsics";
import { getRelativeTime, pluralize } from "@/utils/helper";

export interface ExtrinsicListItemProps {
  blockItem: Block;
}

export default function ExtrinsicListItem({
  blockItem,
}: ExtrinsicListItemProps) {
  const extrinsic = blockItem.extrinsic;
  const slot = blockItem.header.slot;

  // Calculate extrinsic counts
  const {
    ticketsCount,
    disputesCount,
    assurancesCount,
    guaranteesCount,
    preimagesCount,
    totalExtrinsics,
  } = calculateExtrinsicCounts(extrinsic);

  const createdAt = blockItem?.overview?.createdAt;
  const headerHash = blockItem?.overview?.headerHash;
  const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";

  // Build details string (only non-zero counts)
  const detailItems: string[] = [];
  if (ticketsCount > 0) detailItems.push(`Tickets: ${ticketsCount}`);
  if (disputesCount > 0) detailItems.push(`Disputes: ${disputesCount}`);
  if (guaranteesCount > 0) detailItems.push(`Guarantees: ${guaranteesCount}`);
  if (preimagesCount > 0) detailItems.push(`Preimages: ${preimagesCount}`);
  if (assurancesCount > 0) detailItems.push(`Assurances: ${assurancesCount}`);

  return (
    <Link
      key={headerHash}
      href={`/block/${headerHash}/extrinsic`}
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
          borderBottom: "1px solid #ccc",
        }}
      >
        {/* Left Icon */}
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
          <ReceiptLongIcon fontSize="small" />
        </Box>

        {/* Middle: extrinsic count and relative time */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">
            Slot {slot} - {totalExtrinsics}{" "}
            {pluralize("Extrinsic", totalExtrinsics)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {relativeTime} ago
          </Typography>
        </Box>

        {/* Right: details string */}
        <Box sx={{ textAlign: "right" }}>
          {detailItems.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              {detailItems.join(", ")}
            </Typography>
          )}
        </Box>
      </Box>
    </Link>
  );
}
