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
import { PsiItem } from "@/types"; // Ensure PsiItem is defined as shown

interface PsiTableRow {
  category: string;
  hash: string;
}

interface PsiTableProps {
  data: PsiItem;
}

export default function PsiTable({ data }: PsiTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Convert PsiItem into an array of rows.
  const rows: PsiTableRow[] = [];
  const categories: Array<keyof PsiItem> = [
    "good",
    "bad",
    "wonky",
    "offenders",
  ];
  categories.forEach((category) => {
    const arr = data[category];
    if (arr && arr.length > 0) {
      arr.forEach((hash) => {
        rows.push({ category, hash });
      });
    }
  });

  if (rows.length === 0) {
    return <Typography>No Psi data available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Psi Data
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => {
              const expanded = expandedRow === idx;
              return (
                <TableRow
                  key={idx}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setExpandedRow(expanded ? null : idx)}
                >
                  <TableCell>{idx}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>
                    {expanded ? row.hash : truncateHash(row.hash)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
