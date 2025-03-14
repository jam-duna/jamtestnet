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
import { truncateHash } from "@/utils/helper";

interface EtaTableProps {
  data: string[];
}

export default function EtaTable({ data }: EtaTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <Typography>No eta data available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((hash, idx) => {
              const expanded = expandedRow === idx;
              return (
                <TableRow
                  key={idx}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setExpandedRow(expanded ? null : idx)}
                >
                  <TableCell>{idx}</TableCell>
                  <TableCell>{expanded ? hash : truncateHash(hash)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
