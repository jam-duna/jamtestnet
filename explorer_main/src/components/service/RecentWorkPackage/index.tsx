"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material"; // Report icon
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Block, State } from "@/db/db";
import { Result } from "@/types";
import { truncateHash } from "@/utils/helper";

interface RecentWorkPackageProps {
    states: State[];
    serviceId: number;
}

interface WorkPackageListItemProps {
    state: State;
    serviceId: number;
}

function WorkPackageListItem({state, serviceId}: WorkPackageListItemProps) {
    const createdAt = state.overview?.createdAt || 0;
    const exportsCount = () => {
        let count = -1;
        try {
          state.rho.forEach((rhoItem) => {
            rhoItem?.report.results.forEach((item) => {
              if (item.service_id === serviceId) {
                count = rhoItem.report.package_spec.exports_count;
              }
            })
          })
        } catch(err) {}

        return count;
    }
    const packageHash = () => {
        let hash = "0x00";
        try {
          state.rho.forEach((rhoItem) => {
            rhoItem?.report.results.forEach((item) => {
              if (item.service_id === serviceId) {
                hash = rhoItem.report.package_spec.hash;
              }
            })
          })
        } catch(err) {}

        return hash;
    }
    const results = () => {
        let results: string = "";
        try {
          state.rho.forEach((rhoItem) => {
            rhoItem?.report.results.forEach((item) => {
              if (item.service_id === serviceId) {
                rhoItem.report.results.forEach((result) => {
                  results += (result.result.ok ? "ok " : "error ");
                })
              }
            })
          })
        } catch(err) {}

        return results;
    }
  
    return (
      <Link
        key={packageHash()}
        href={`/workpackage/${packageHash()}/`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderRadius: 1,
            transition: "background-color 0.2s",
            "&:hover": { backgroundColor: "#f9f9f9" },
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Left icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              mr: 2,
            }}
          >
            <AssignmentIcon fontSize="small" />
          </Box>
  
          {/* Middle: Report count and relative time */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">
              exports count  {exportsCount()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {Math.floor((Date.now() - createdAt) / 1000)} seconds ago
            </Typography>
          </Box>
  
          {/* Right: truncated header hash */}
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{ color: "#1976d2", textDecoration: "underline" }}
            >
              {truncateHash(packageHash())}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              results {results()}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

export function RecentWorkPackages({states, serviceId}: RecentWorkPackageProps) {
  const displayStates = states.slice(0, 8);

  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 2, px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Recent Work Packages
      </Typography>

        {(displayStates && displayStates.length > 0) ? 
            (displayStates.map((state) => {
                return (
                    <WorkPackageListItem
                        key={state.overview?.headerHash}
                        state={state}
                        serviceId={serviceId}
                    />
                );
            })) : 
            (<Typography
                        variant="subtitle2"
                        sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                No work packages
            </Typography>)}
    </Paper>
  );
}
