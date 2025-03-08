"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { BetaItem } from "@/types"; // Adjust the import path if needed
import { truncateHash } from "@/utils/helper";

interface BetaTableProps {
  data: BetaItem[];
}

export default function BetaTable({ data }: BetaTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <Typography>No beta items available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Header Hash</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>MMR Peaks</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>State Root</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reported Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                <TableCell>
                  {expandedRow === idx
                    ? item.header_hash
                    : truncateHash(item.header_hash)}
                </TableCell>
                <TableCell>
                  {(() => {
                    const peaks = item.mmr.peaks
                      .filter((p) => p !== null)
                      .join("\n");
                    return expandedRow === idx ? peaks : truncateHash(peaks);
                  })()}
                </TableCell>
                <TableCell>
                  {expandedRow === idx
                    ? item.state_root
                    : truncateHash(item.state_root)}
                </TableCell>
                <TableCell sx={{ minWidth: "100px", whiteSpace: "nowrap" }}>
                  {item.reported.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
