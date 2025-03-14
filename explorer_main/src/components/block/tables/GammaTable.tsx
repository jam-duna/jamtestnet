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
import { LabeledRow } from "@/components/display/LabeledRow";
import TableFormat1 from "../tables/TableFormat1"; // Adjust the path as needed
import { truncateHash } from "@/utils/helper";
import { GammaItem } from "@/types"; // Ensure GammaItem and related types are defined

interface GammaTableProps {
  data: GammaItem[];
}

export default function GammaTable({ data }: GammaTableProps) {
  // Use an array of booleans to track expansion state for each gamma item.
  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    data.map(() => false)
  );

  const toggleExpanded = (idx: number) => {
    setExpandedStates((prev) => {
      const newStates = [...prev];
      newStates[idx] = !newStates[idx];
      return newStates;
    });
  };

  if (!data || data.length === 0) {
    return <Typography>No gamma items available.</Typography>;
  }

  return (
    <Box sx={{ my: 2 }}>
      {data.map((item, idx) => (
        <Box key={idx} sx={{ mb: 4, p: 2 }}>
          {/* 1. Separate Gamma Z out of table */}
          <Box sx={{ mb: 2, pb: 3, borderBottom: "1px solid #aaa" }}>
            <LabeledRow
              label={"Gamma Z"}
              tooltip={"Gamma Z Description"}
              labelVariant="h6"
              value={
                <Typography
                  variant="body1"
                  sx={{ cursor: "pointer" }}
                  onClick={() => toggleExpanded(idx)}
                >
                  {expandedStates[idx]
                    ? item.gamma_z
                    : truncateHash(item.gamma_z)}
                </Typography>
              }
            />
          </Box>

          {/* 2. Table only containing Gamma S Tickets and Gamma A */}

          <Box sx={{ my: 2, pt: 3, pb: 7, borderBottom: "1px solid #aaa" }}>
            <LabeledRow
              label={"Gamma S Tickets & Gamma A"}
              tooltip={"Gamma S Tickets & Gamma A Description"}
              value={<></>}
              labelVariant="h6"
            />
            <TableContainer sx={{ mt: 3 }} component={Paper}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Gamma S Tickets
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Gamma A</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({
                    length:
                      item.gamma_s && item.gamma_s.tickets
                        ? item.gamma_s.tickets.length
                        : 0,
                  }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>{i}</TableCell>
                      <TableCell>
                        {item.gamma_s &&
                        item.gamma_s.tickets &&
                        item.gamma_s.tickets[i]
                          ? expandedStates[idx]
                            ? `${item.gamma_s.tickets[i].id} (attempt: ${item.gamma_s.tickets[i].attempt})`
                            : `${truncateHash(
                                item.gamma_s.tickets[i].id
                              )} (attempt: ${item.gamma_s.tickets[i].attempt})`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.gamma_a && item.gamma_a[i]
                          ? expandedStates[idx]
                            ? `${item.gamma_a[i].id} (attempt: ${item.gamma_a[i].attempt})`
                            : `${truncateHash(item.gamma_a[i].id)} (attempt: ${
                                item.gamma_a[i].attempt
                              })`
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 3. Display gamma_k using TableFormat1 */}
          <Box sx={{ mt: 5 }}>
            <LabeledRow
              label={"Gamma K Table"}
              tooltip={"Gamma K Tickets Description"}
              value={<></>}
              labelVariant="h6"
              mb={3}
            />
            <Box>
              {" "}
              {item.gamma_k && item.gamma_k.length > 0 ? (
                <TableFormat1 data={item.gamma_k} />
              ) : (
                <Typography variant="body2">
                  No Gamma K data available.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
