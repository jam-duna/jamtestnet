"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { formatDate, truncateHash } from "@/utils/helper";

// Extend SquareContent to include headerHash.
export interface SquareContent {
  serviceName: string;
  workPackageHash: string;
  headerHash?: string;
  isBusy: boolean;
}

export interface BlockListGridProps {
  /** Sorted list of timeslots (columns). */
  timeslots: number[];
  /** Sorted list of cores (rows). */
  coreIndex: number;
  /** data[coreIndex][timeslot] = { serviceName, workPackageHash, headerHash, isBusy } */
  data: Record<number, Record<number, SquareContent>>;
}

export function BlockListGrid({
  timeslots,
  coreIndex,
  data,
}: BlockListGridProps) {
  const router = useRouter();

  return (
    <>
      <TableContainer component={Paper} sx={{ width: "100%", mb: 7 }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }} size="small">
          <TableHead>
            <TableRow>
              {/* Timeslot headers */}
              {timeslots.map((timestamp) => (
                <TableCell
                  key={timestamp}
                  align="center"
                  sx={{ border: "1px solid #ddd", backgroundColor: "#eee" }}
                >
                  <Typography variant="subtitle2">
                    {formatDate(timestamp)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow key={coreIndex}>
                {/* Data cells for each timeslot */}
                {timeslots.map((slot) => {
                  const cell = data[coreIndex]?.[slot];
                  return (
                    <TableCell
                      key={slot}
                      align="center"
                      sx={{
                        backgroundColor: cell?.isBusy
                          ? "lightgreen"
                          : "#f0f0f0",
                        border: "1px solid #ddd",
                        padding: "8px",
                        wordBreak: "break-all",
                      }}
                    >
                      {/* Service ID clickable */}
                      {cell?.serviceName ? (
                        <Typography
                          variant="body2"
                          onClick={() =>
                            router.push(`/service/${cell.serviceName}`)
                          }
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {cell.serviceName}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {cell?.serviceName || ""}
                        </Typography>
                      )}
                      {/* Work Package Hash clickable */}
                      {cell?.workPackageHash.length > 1 && cell?.headerHash ? (
                        <Typography
                          variant="body2"
                          onClick={() =>
                            router.push(
                              `/workpackage/${cell.workPackageHash}`
                            )
                          }
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {truncateHash(cell.workPackageHash)}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {cell?.workPackageHash.length > 1
                            ? truncateHash(cell.workPackageHash)
                            : "No Work Package"}
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
