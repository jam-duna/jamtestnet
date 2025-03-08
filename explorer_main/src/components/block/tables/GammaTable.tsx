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
import TableFormat1 from "../tables/TableFormat1"; // Adjust the path as needed
import { truncateHash } from "@/utils/helper";
import { GammaItem } from "@/types"; // Ensure GammaItem and KeyedItem are defined in "@/types"

interface GammaTableProps {
  data: GammaItem[];
}

export default function GammaTable({ data }: GammaTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <Typography>No gamma items available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Gamma Z</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Gamma K</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Gamma S Tickets</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Gamma A</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => {
              const expanded = expandedRow === idx;
              return (
                <TableRow
                  key={idx}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setExpandedRow(expanded ? null : idx)}
                >
                  <TableCell>{idx}</TableCell>
                  <TableCell sx={{ minWidth: "50px", whiteSpace: "nowrap" }}>
                    {expanded ? item.gamma_z : truncateHash(item.gamma_z)}
                  </TableCell>
                  {/*
                  <TableCell>
                    <Box>
                      <TableFormat1 data={item.gamma_k} />
                    </Box>
                  </TableCell>
                  */}
                  <TableCell>
                    {item.gamma_s && item.gamma_s.tickets.length > 0
                      ? item.gamma_s.tickets
                          .map((ticket) =>
                            expanded
                              ? `${ticket.id} (attempt: ${ticket.attempt})`
                              : `${truncateHash(ticket.id)} (attempt: ${
                                  ticket.attempt
                                })`
                          )
                          .join("\n")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.gamma_a && item.gamma_a.length > 0
                      ? item.gamma_a
                          .map((ga) =>
                            expanded
                              ? `${ga.id} (attempt: ${ga.attempt})`
                              : `${truncateHash(ga.id)} (attempt: ${
                                  ga.attempt
                                })`
                          )
                          .join("\n")
                      : "N/A"}
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
