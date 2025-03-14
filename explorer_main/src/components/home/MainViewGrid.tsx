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
  Button,
} from "@mui/material";
import { truncateHash } from "@/utils/helper";

export interface SquareContent {
  serviceName: string;
  workPackageHash: string;
  isBusy: boolean;
}

export interface MainViewGridProps {
  /** Sorted list of timeslots (columns). */
  timeslots: number[];
  /** Sorted list of cores (rows). */
  cores: number[];
  /** data[coreIndex][timeslot] = { serviceName, workPackageHash, isBusy } */
  data: Record<number, Record<number, SquareContent>>;
}

export default function MainViewGrid({
  timeslots,
  cores,
  data,
}: MainViewGridProps) {
  const router = useRouter();
  const [showOnlyWorkPackages, setShowOnlyWorkPackages] = useState(false);

  // Compute filtered cores and timeslots when toggle is on.
  const { filteredCores, filteredTimeslots } = useMemo(() => {
    if (!showOnlyWorkPackages) {
      return { filteredCores: cores, filteredTimeslots: timeslots };
    }
    // Build a map of busy cells: busyCells[core] is a Set of slots that are busy.
    const busyCells: Record<number, Set<number>> = {};
    for (const core of cores) {
      for (const slot of timeslots) {
        if (data[core]?.[slot]?.isBusy) {
          if (!busyCells[core]) busyCells[core] = new Set();
          busyCells[core].add(slot);
        }
      }
    }
    // Filter cores that have at least one busy cell.
    const filteredCores = cores.filter((core) => busyCells[core]?.size);
    // Filter timeslots that appear in at least one busy cell in the filtered cores.
    const filteredTimeslots = timeslots.filter((slot) =>
      filteredCores.some((core) => busyCells[core].has(slot))
    );
    return { filteredCores, filteredTimeslots };
  }, [showOnlyWorkPackages, cores, timeslots, data]);

  return (
    <>
      <TableContainer component={Paper} sx={{ width: "100%", mb: 7 }}>
        <Table sx={{ width: "100%", tableLayout: "fixed" }} size="small">
          <TableHead>
            <TableRow>
              {/* Top-left cell: Blocks */}
              <TableCell
                align="center"
                sx={{ border: "1px solid #ddd", backgroundColor: "#eee" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Blocks
                </Typography>
                <Typography
                  variant="caption"
                  onClick={() => router.push("/list/block")}
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Block List...
                </Typography>
              </TableCell>
              {/* Timeslot headers */}
              {filteredTimeslots.map((slot) => (
                <TableCell
                  key={slot}
                  align="center"
                  sx={{ border: "1px solid #ddd", backgroundColor: "#eee" }}
                >
                  <Typography variant="subtitle2">Timeslot {slot}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCores.map((coreIndex) => (
              <TableRow key={coreIndex}>
                {/* Left cell: Core */}
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #ddd", backgroundColor: "#eee" }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Core {coreIndex}
                  </Typography>
                  <Typography
                    variant="caption"
                    onClick={() => router.push(`/core/${coreIndex}`)}
                    sx={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Core {coreIndex} List...
                  </Typography>
                </TableCell>
                {/* Data cells for each timeslot */}
                {filteredTimeslots.map((slot) => {
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
                      <Typography variant="body2">
                        {cell?.serviceName || ""}
                      </Typography>
                      <Typography variant="body2">
                        {truncateHash(cell?.workPackageHash) ||
                          "No Work Package"}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
