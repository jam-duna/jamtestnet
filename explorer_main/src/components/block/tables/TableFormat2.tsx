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

interface TableFormat2Props {
  data: string[][];
}

// Helper function to transpose a 2D array.
function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export default function TableFormat2({ data }: TableFormat2Props) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  // Transpose the data so that columns become rows.
  const transposedData = transpose(data);
  // Now, the number of header columns equals the number of rows in the original data.
  const numHeaders = data.length;
  const headerCells = Array.from(
    { length: numHeaders },
    (_, idx) => `Value ${idx}`
  );

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {/* Index header for transposed rows */}
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                #
              </TableCell>
              {headerCells.map((header, idx) => (
                <TableCell
                  key={idx}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transposedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  setExpandedRow(expandedRow === rowIndex ? null : rowIndex)
                }
              >
                <TableCell>{rowIndex}</TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {typeof cell === "string" && cell.startsWith("0x")
                      ? expandedRow === rowIndex
                        ? cell
                        : truncateHash(cell)
                      : cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
