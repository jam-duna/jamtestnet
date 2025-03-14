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
import { ChiItem } from "@/types"; // Adjust the import path if needed

interface ChiTableProps {
  data: ChiItem[];
}

export default function ChiTable({ data }: ChiTableProps) {
  if (!data || data.length === 0) {
    return <Typography>No chi items available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Chi M</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Chi A</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Chi V</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Chi G</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{item.chi_m}</TableCell>
                <TableCell>{item.chi_a}</TableCell>
                <TableCell>{item.chi_v}</TableCell>
                <TableCell>{JSON.stringify(item.chi_g)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
