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

interface TableFormat1Props {
  data: Array<Record<string, any>>;
}

export default function TableFormat1({ data }: TableFormat1Props) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  // Assume that all objects have the same keys.
  const keys = Object.keys(data[0]);

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {/* New column for row index */}
              <TableCell
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                #
              </TableCell>
              {keys.map((key) => (
                <TableCell
                  key={key}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {key.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                {/* Row index */}
                <TableCell>{idx}</TableCell>
                {keys.map((key) => (
                  <TableCell key={key}>
                    {typeof row[key] === "string" && row[key].startsWith("0x")
                      ? expandedRow === idx
                        ? row[key]
                        : truncateHash(row[key])
                      : row[key]}
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
