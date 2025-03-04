"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Button,
  Box,
} from "@mui/material";
import { db, BlockRecord } from "@/db/db";
import { Guarantee } from "@/types";
import { pluralize, truncateHash } from "@/utils/helper";
import Link from "next/link";

export default function WorkReportListPage() {
  const params = useParams();
  const router = useRouter();
  const headerHash = params.headerHash as string;

  // Instead of Report | null, we expect an array of GuaranteeObject
  const [workReports, setWorkReports] = useState<Guarantee[]>([]);

  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record: BlockRecord | undefined) => {
          if (record && record.block && record.block.extrinsic) {
            // Use record.block.extrinsic.guarantees and assume it matches GuaranteeObject[]
            const reports = record.block.extrinsic.guarantees || [];
            setWorkReports(reports as Guarantee[]);
          }
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  const handleDownloadData = () => {
    alert("Implement your download logic here!");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Work Report List
      </Typography>
      {/*
      <Typography variant="body1" gutterBottom>
        Block {formatHash(headerHash)}
      </Typography>
      */}

      {/* Etherscan-like header: total count + download button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="body1" gutterBottom>
          A total of {workReports.length} work{" "}
          {pluralize(" report", workReports.length)} found on block{" "}
          <Link href={`/block/${headerHash}`}>{headerHash}</Link>
        </Typography>
        {/*
       <Button variant="outlined" onClick={handleDownloadData}>
          Download Page Data
        </Button>
       */}
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
                <TableCell sx={{ fontWeight: "bold" }}>Result (OK)</TableCell>
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
                  // Create a short version of the package_spec hash for display:
                  const shortReportHash = truncateHash(pkgSpecHash);

                  return (
                    <TableRow
                      key={index}
                      hover
                      onClick={() =>
                        window.open(
                          `/block/${headerHash}/work-report/${pkgSpecHash}`,
                          "_self"
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell sx={{ color: "blue" }}>
                        {shortReportHash}
                      </TableCell>
                      <TableCell>{coreIndex ?? "N/A"}</TableCell>
                      {/* Block header hash cell */}
                      <TableCell
                        sx={{ color: "blue" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/block/${headerHash}`);
                        }}
                      >
                        {truncateHash(headerHash)}
                      </TableCell>
                      {/* Slot cell */}
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
                      {/* <TableCell>{resultOk ?? "N/A"}</TableCell> */}
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
