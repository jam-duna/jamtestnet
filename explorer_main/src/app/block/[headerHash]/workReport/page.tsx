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
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { db, Block, State } from "@/db/db";
import { Guarantee } from "@/types";
import { pluralize, truncateHash } from "@/utils/helper";
import { useWorkReportStatuses } from "@/hooks/workReport/useWorkReportStatuses";

export default function WorkReportListPage() {
  const router = useRouter();
  const params = useParams();
  const headerHash = params.headerHash as string;

  const [workReports, setWorkReports] = useState<Guarantee[]>([]);
  const [stateRecord, setStateRecord] = useState<State | null>(null);
  const [blockRecord, setBlockRecord] = useState<Block | null>(null);

  // Fetch work reports from the block record.
  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("overview.headerHash")
        .equals(headerHash)
        .first()
        .then((record: Block | undefined) => {
          if (record && record.header && record.extrinsic) {
            setBlockRecord(record);
            const reports = record.extrinsic.guarantees || [];
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
        .where("overview.headerHash")
        .equals(headerHash)
        .first()
        .then((record: State | undefined) => {
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }
  }, [headerHash]);

  // Prepare list of report package_spec hashes.
  const reportHashes = workReports.map(
    (reportData) => reportData.report.package_spec.hash
  );

  // Use custom hook to get statuses based on the current block slot.
  const currentSlot = blockRecord?.overview?.slot || 0;
  const statuses = useWorkReportStatuses(reportHashes, currentSlot);

  const handleRowClick = (pkgSpecHash: string) => {
    window.open(`/block/${headerHash}/workReport/${pkgSpecHash}`, "_self");
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
          <Link href={`/block/${headerHash}?type=headerHash`}>
            {headerHash}
          </Link>
        </Typography>
      </Box>
      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Report Hash</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Core Index</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Header Hash</TableCell>
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
                          router.push(`/block/${headerHash}?type=headerHash`);
                        }}
                      >
                        {truncateHash(headerHash)}
                      </TableCell>
                      <TableCell>{slot ?? "N/A"}</TableCell>
                      <TableCell>{serviceId ?? "N/A"}</TableCell>
                      <TableCell>{accumulateGas ?? "N/A"}</TableCell>
                      <TableCell>{signatures.length}</TableCell>
                      <TableCell>
                        {statuses[pkgSpecHash] ? statuses[pkgSpecHash] : "N/A"}
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
