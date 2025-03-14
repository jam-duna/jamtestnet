"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { PiItem, PiEntry } from "@/types";

interface PiTableProps {
  data: PiItem;
}

export default function PiTable({ data }: PiTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Helper to render a table for PiEntry arrays.
  const renderPiEntries = (entries: PiEntry[], title: string) => {
    if (!entries || entries.length === 0) {
      return <Typography>No {title} entries available.</Typography>;
    }
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Blocks</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tickets</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Pre Images</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Pre Images Size
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Guarantees</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assurances</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, idx) => {
                const expanded = expandedRow === idx;
                return (
                  <TableRow
                    key={idx}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => setExpandedRow(expanded ? null : idx)}
                  >
                    <TableCell>{idx}</TableCell>
                    <TableCell>{entry.blocks}</TableCell>
                    <TableCell>{entry.tickets}</TableCell>
                    <TableCell>{entry.pre_images}</TableCell>
                    <TableCell>{entry.pre_images_size}</TableCell>
                    <TableCell>{entry.guarantees}</TableCell>
                    <TableCell>{entry.assurances}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ my: 4 }}>
      {renderPiEntries(data.current, "Current")}
      <Divider sx={{ my: 5 }} />
      {renderPiEntries(data.last, "Last")}
    </Box>
  );
}
