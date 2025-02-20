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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PiItem, PiEntry } from "@/types";

// Helper to sum an array of PiEntry values.
function sumEntries(entries: PiEntry[]): PiEntry {
  return entries.reduce(
    (acc, entry) => ({
      blocks: acc.blocks + entry.blocks,
      tickets: acc.tickets + entry.tickets,
      pre_images: acc.pre_images + entry.pre_images,
      pre_images_size: acc.pre_images_size + entry.pre_images_size,
      guarantees: acc.guarantees + entry.guarantees,
      assurances: acc.assurances + entry.assurances,
    }),
    {
      blocks: 0,
      tickets: 0,
      pre_images: 0,
      pre_images_size: 0,
      guarantees: 0,
      assurances: 0,
    }
  );
}

// Renders a small table for aggregated totals.
function renderTotalsTable(totals: PiEntry) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Blocks</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Tickets</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Pre Images</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Pre Images Size</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Guarantees</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Assurances</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{totals.blocks}</TableCell>
          <TableCell>{totals.tickets}</TableCell>
          <TableCell>{totals.pre_images}</TableCell>
          <TableCell>{totals.pre_images_size}</TableCell>
          <TableCell>{totals.guarantees}</TableCell>
          <TableCell>{totals.assurances}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

// Renders detailed table of entries.
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
              <TableCell sx={{ fontWeight: "bold" }}>Pre Images Size</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Guarantees</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assurances</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, idx) => (
              <TableRow key={idx} hover sx={{ cursor: "pointer" }}>
                <TableCell>{idx}</TableCell>
                <TableCell>{entry.blocks}</TableCell>
                <TableCell>{entry.tickets}</TableCell>
                <TableCell>{entry.pre_images}</TableCell>
                <TableCell>{entry.pre_images_size}</TableCell>
                <TableCell>{entry.guarantees}</TableCell>
                <TableCell>{entry.assurances}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Renders a comparison summary table between current and last.
function renderComparisonTable(currentTotals: PiEntry, lastTotals: PiEntry) {
  const metrics = [
    { key: "blocks", label: "Blocks" },
    { key: "tickets", label: "Tickets" },
    { key: "pre_images", label: "Pre Images" },
    { key: "pre_images_size", label: "Pre Images Size" },
    { key: "guarantees", label: "Guarantees" },
    { key: "assurances", label: "Assurances" },
  ];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Metric</TableCell>
          <TableCell sx={{ fontWeight: "bold" }}>Comparison to Last</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {metrics.map((metric) => {
          const curValue = currentTotals[metric.key as keyof PiEntry];
          const lastValue = lastTotals[metric.key as keyof PiEntry];
          const diffValue = curValue - lastValue;
          let compText = "";
          if (diffValue > 0) {
            compText = `${diffValue} more`;
          } else if (diffValue < 0) {
            compText = `${Math.abs(diffValue)} fewer`;
          } else {
            compText = "No change";
          }
          return (
            <TableRow key={metric.key}>
              <TableCell>{metric.label}</TableCell>
              <TableCell>{compText}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function PiTable({ data }: { data: PiItem }) {
  // Aggregate totals for current and last arrays.
  const currentTotals = sumEntries(data.current);
  const lastTotals = sumEntries(data.last);

  return (
    <Box sx={{ my: 4 }}>
      {/* Accordion for Current Data */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current
            </Typography>
            <TableContainer>{renderTotalsTable(currentTotals)}</TableContainer>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderPiEntries(data.current, "Current Details")}
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 5 }} />

      {/* Accordion for Last Data */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Last
            </Typography>
            <TableContainer>{renderTotalsTable(lastTotals)}</TableContainer>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderPiEntries(data.last, "Last Details")}
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 5 }} />

      {/* Accordion for Comparison */}
      {renderComparisonTable(currentTotals, lastTotals)}
    </Box>
  );
}
