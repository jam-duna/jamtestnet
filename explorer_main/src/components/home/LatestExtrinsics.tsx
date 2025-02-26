"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";
import { BlockRecord } from "../../../db";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; // Example icon

type ExtrinsicListsProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

export default function ExtrinsicLists({
  latestBlocks,
  getRelativeTime,
}: ExtrinsicListsProps) {
  // Filter blocks that have at least one extrinsic event
  const filteredBlocks = latestBlocks
    .filter((blockItem) => {
      const extrinsic = blockItem.block.extrinsic;
      if (!extrinsic) return false;

      const ticketsCount = Array.isArray(extrinsic.tickets)
        ? extrinsic.tickets.length
        : 0;
      const disputesCount = extrinsic.disputes
        ? (extrinsic.disputes.verdicts?.length || 0) +
          (extrinsic.disputes.culprits?.length || 0) +
          (extrinsic.disputes.faults?.length || 0)
        : 0;
      const assurancesCount = Array.isArray(extrinsic.assurances)
        ? extrinsic.assurances.length
        : 0;
      const guaranteesCount = Array.isArray(extrinsic.guarantees)
        ? extrinsic.guarantees.length
        : 0;
      const preimagesCount = Array.isArray(extrinsic.preimages)
        ? extrinsic.preimages.length
        : 0;
      const totalEvents =
        ticketsCount +
        disputesCount +
        assurancesCount +
        guaranteesCount +
        preimagesCount;
      return totalEvents > 0;
    })
    .slice(0, 5);

  return (
    <Paper sx={{ px: 0 }} variant="outlined">
      <Typography
        variant="h6"
        sx={{ px: 1.5, py: 2, borderBottom: "1px solid #ccc" }}
      >
        Extrinsic Lists
      </Typography>

      {filteredBlocks.map((blockItem) => {
        // Calculate extrinsic counts
        const extrinsic = blockItem.block.extrinsic;
        const ticketsCount = Array.isArray(extrinsic.tickets)
          ? extrinsic.tickets.length
          : 0;
        const disputesCount = extrinsic.disputes
          ? (extrinsic.disputes.verdicts?.length || 0) +
            (extrinsic.disputes.culprits?.length || 0) +
            (extrinsic.disputes.faults?.length || 0)
          : 0;
        const guaranteesCount = Array.isArray(extrinsic.guarantees)
          ? extrinsic.guarantees.length
          : 0;
        const preimagesCount = Array.isArray(extrinsic.preimages)
          ? extrinsic.preimages.length
          : 0;
        const assurancesCount = Array.isArray(extrinsic.assurances)
          ? extrinsic.assurances.length
          : 0;
        const totalEvents =
          ticketsCount +
          disputesCount +
          assurancesCount +
          guaranteesCount +
          preimagesCount;

        // Compute relative time
        const createdAt = blockItem.overview.createdAt;
        const relativeTime = createdAt ? getRelativeTime(createdAt) : "N/A";

        // Build details string: only show non-zero counts
        const detailItems: string[] = [];
        if (ticketsCount > 0) detailItems.push(`Tickets: ${ticketsCount}`);
        if (disputesCount > 0) detailItems.push(`Disputes: ${disputesCount}`);
        if (guaranteesCount > 0)
          detailItems.push(`Guarantees: ${guaranteesCount}`);
        if (preimagesCount > 0)
          detailItems.push(`Preimages: ${preimagesCount}`);
        if (assurancesCount > 0)
          detailItems.push(`Assurances: ${assurancesCount}`);

        return (
          <Link
            key={blockItem.headerHash}
            href={`/block/${blockItem.headerHash}/extrinsic`}
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
                  {totalEvents} Event{totalEvents !== 1 ? "s" : ""}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {relativeTime} ago
                </Typography>
              </Box>

              {/* Right: details string (only non-zero categories) */}
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
      })}

      <Link
        href={`/extrinsic-list`}
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
          View All Extrinsics
        </Typography>
      </Link>
    </Paper>
  );
}
