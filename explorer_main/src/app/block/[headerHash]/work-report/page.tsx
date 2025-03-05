"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { db, BlockRecord, StateRecord } from "@/db/db";
import { Guarantee } from "@/types";
import { pluralize, truncateHash } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function WorkReportListPage() {
  const router = useRouter();
  const params = useParams();
  const headerHash = params.headerHash as string;

  const [workReports, setWorkReports] = useState<Guarantee[]>([]);
  const [stateRecord, setStateRecord] = useState<StateRecord | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  // Fetch work reports from the block record.
  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record: BlockRecord | undefined) => {
          if (record && record.block && record.block.extrinsic) {
            const reports = record.block.extrinsic.guarantees || [];
            setWorkReports(reports as Guarantee[]);
            console.log("Work reports:", reports);
          }
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  // Fetch state record to use its xi field.
  useEffect(() => {
    if (headerHash) {
      db.states
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record: StateRecord | undefined) => {
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }
  }, [headerHash]);

  // Helper: derive work report status from the xi field.
  function getWorkReportStatus(pkgSpecHash: string, xi: any): string {
    if (!xi || !Array.isArray(xi)) return "Unknown";

    console.log(pkgSpecHash);
    xi.forEach((item, idx) => {
      console.log(idx, item[0], item[1]);
    });

    // Assume each entry in xi has a property workReportHash.
    const found = xi.find(
      (entry: [string, string]) =>
        entry[0] === pkgSpecHash || entry[1] === pkgSpecHash
    );

    return found ? "Completed" : "Pending";
  }

  // Optionally, pre-fetch statuses for all work reports.
  useEffect(() => {
    if (stateRecord && workReports.length > 0) {
      workReports.forEach((reportData) => {
        const pkgSpecHash = reportData.report.package_spec.hash;
        // Only update if not already set.
        if (!statuses[pkgSpecHash]) {
          const status = getWorkReportStatus(pkgSpecHash, stateRecord.state.xi);
          setStatuses((prev) => ({ ...prev, [pkgSpecHash]: status }));
        }
      });
    }
  }, [stateRecord, workReports]);

  const handleRowClick = (pkgSpecHash: string) => {
    window.open(`/block/${headerHash}/work-report/${pkgSpecHash}`, "_self");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Work Report List
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="body1" gutterBottom>
          A total of {workReports.length} work{" "}
          {pluralize("report", workReports.length)} found on block{" "}
          <Link href={`/block/${headerHash}`}>{headerHash}</Link>
        </Typography>
      </Box>
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Report Hash</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Core Index</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Block</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Report Slot</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Service ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Accumulate Gas
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Signatures</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workReports.length > 0 ? (
                workReports.map((reportData, index) => {
                  const pkgSpecHash = reportData.report.package_spec.hash;
                  const coreIndex = reportData.report.core_index;
                  const slot = reportData.slot;
                  const serviceId = reportData.report.results?.[0]?.service_id;
                  const accumulateGas =
                    reportData.report.results?.[0]?.accumulate_gas;
                  const signatures = reportData.signatures;
                  const shortReportHash = truncateHash(pkgSpecHash);

                  return (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => handleRowClick(pkgSpecHash)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell sx={{ color: "blue" }}>
                        {shortReportHash}
                      </TableCell>
                      <TableCell>{coreIndex ?? "N/A"}</TableCell>
                      <TableCell
                        sx={{ color: "blue" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/block/${headerHash}`);
                        }}
                      >
                        {truncateHash(headerHash)}
                      </TableCell>
                      <TableCell
                        sx={{ color: "blue" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/block/${headerHash}/work-report/${pkgSpecHash}`
                          );
                        }}
                      >
                        {slot ?? "N/A"}
                      </TableCell>
                      <TableCell>{serviceId ?? "N/A"}</TableCell>
                      <TableCell>{accumulateGas ?? "N/A"}</TableCell>
                      <TableCell>{signatures.length}</TableCell>
                      <TableCell>
                        {stateRecord
                          ? getWorkReportStatus(
                              pkgSpecHash,
                              stateRecord.state.xi
                            )
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No work reports available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
