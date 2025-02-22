"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { db, BlockRecord } from "../../../../../db";

export default function WorkReportListPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;

  const [workReports, setWorkReports] = useState<any[]>([]);

  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record: BlockRecord | undefined) => {
          if (record && record.rawData && record.rawData.extrinsic) {
            // If your rawData.extrinsic.guarantees array contains
            // objects in the format you provided, store them in workReports
            const reports = record.rawData.extrinsic.guarantees || [];
            setWorkReports(reports);
          }
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  // Example download handler
  const handleDownloadData = () => {
    alert("Implement your download logic here!");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Work Report
      </Typography>
      <Typography variant="h6" gutterBottom>
        For Block {headerHash}
      </Typography>

      {/* Etherscan-like header: total count + download button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="subtitle1">
          A total of {workReports.length} work report(s) found
        </Typography>
        <Button variant="outlined" onClick={handleDownloadData}>
          Download Page Data
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/*
                  Decide which fields are important for your table columns.
                  Here’s an example set of columns resembling Etherscan:
                */}
                <TableCell sx={{ fontWeight: "bold" }}>Report Hash</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Core Index</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Block</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Slot</TableCell>
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
                  // Safely extract the fields you want to display:
                  const pkgSpecHash = reportData?.report?.package_spec?.hash;
                  const coreIndex = reportData?.report?.core_index;
                  const slot = reportData?.slot;
                  const serviceId =
                    reportData?.report?.results?.[0]?.service_id;
                  const accumulateGas =
                    reportData?.report?.results?.[0]?.accumulate_gas;
                  const signatures = reportData?.signatures || [];
                  const resultOk = reportData?.report?.results?.[0]?.result?.ok;

                  // You might create a short version of the hash for display:
                  const shortReportHash = pkgSpecHash
                    ? pkgSpecHash.slice(0, 10) + "..." + pkgSpecHash.slice(-6)
                    : "N/A";

                  return (
                    <TableRow
                      key={index}
                      hover
                      // Example: navigate to a detail page when the row is clicked
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
                      <TableCell>{headerHash.slice(0, 8) + "..."}</TableCell>
                      <TableCell>{slot ?? "N/A"}</TableCell>
                      <TableCell>{serviceId ?? "N/A"}</TableCell>
                      <TableCell>{accumulateGas ?? "N/A"}</TableCell>
                      <TableCell>{signatures.length}</TableCell>
                      <TableCell>{resultOk ?? "N/A"}</TableCell>
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
