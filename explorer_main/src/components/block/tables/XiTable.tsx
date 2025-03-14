"use client";

import React from "react";
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

interface XiTableProps {
  data: string[][];
}

export default function XiTable({ data }: XiTableProps) {
  // Map over data to keep the original index, then filter out empty rows.
  const nonEmptyRows = data
    .map((row, index) => ({ index, row }))
    .filter(({ row }) => row.length > 0);

  if (nonEmptyRows.length === 0) {
    return <Typography>No xi values found.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Index
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Value(s)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nonEmptyRows.map(({ index, row }) => (
              <TableRow key={index} hover>
                <TableCell>{index}</TableCell>
                <TableCell>{row.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
