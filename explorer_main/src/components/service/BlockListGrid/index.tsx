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
  Box,
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
  timestamps: number[];
  /** Sorted list of cores (rows). */
  cores: number[];
  /** data[coreIndex][timeslot] = { serviceName, workPackageHash, headerHash, isBusy } */
  data: Record<number, Record<number, SquareContent>>;
  serviceId: string;
}

export function BlockListGrid({
  timeslots,
  timestamps,
  cores,
  data,
  serviceId,
}: BlockListGridProps) {
  const router = useRouter();

  return (
    <Box width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        >
      <Typography variant="h6" sx={{mb: 3}}>Block Details</Typography>
      <TableContainer component={Paper} sx={{ width: "100%", mb: 7 }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }} size="small">
          <TableHead>
            <TableRow>
              {/* Top-left cell: Blocks */}
              <TableCell
                align="center"
                sx={{
                  border: "1px solid #ddd",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                  transition: "all .5s ease-in-out",
                  ":hover": {
                      backgroundColor: "#ddd",
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold"
                    onClick={() => router.push("/list/block")}
                    sx={{cursor: "pointer" }}>
                  Blocks
                </Typography>
              </TableCell>
              {/* Timeslot headers */}
              {timestamps.map((timestampValue, timestampIndex) => (
                <TableCell
                  key={timestampIndex}
                  align="center"
                  sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#eee",
                    cursor: "pointer",
                    transition: "all .5s ease-in-out",
                    ":hover": {
                        backgroundColor: "#ddd",
                    }
                  }}
                  onClick={() => {router.push(`/block/${timeslots[timestampIndex]}`)}}
                >
                  <Typography variant="subtitle2">
                    {formatDate(timestampValue)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cores.map((coreIndex) => (
              <TableRow key={coreIndex}>
                {/* Left cell: Core */}
                <TableCell
                  align="center"
                  onClick={() => router.push(`/core/${coreIndex}`)}
                  sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#eee",
                    cursor: "pointer",
                    transition: "all .5s ease-in-out",
                    ":hover": {
                        backgroundColor: "#ddd",
                    }
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Core {coreIndex}
                  </Typography>
                </TableCell>
                {/* Data cells for each timeslot */}
                {timestamps.map((timestampValue, timestampIndex) => {
                  const cell = data[coreIndex]?.[timestampValue];
                  return (
                    <TableCell
                      key={timestampValue}
                      align="center"
                      sx={{
                        backgroundColor: cell?.isBusy
                          ? (cell?.serviceName === serviceId ? "lightgreen" : "#f0f0f0")
                          : "#f0f0f0",
                        border: "1px solid #ddd",
                        padding: "8px",
                        wordBreak: "break-all",
                        cursor: "pointer",
                      }}
                    >
                      {/* Service ID clickable */}
                      {cell?.serviceName && cell?.serviceName !== serviceId ? (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
