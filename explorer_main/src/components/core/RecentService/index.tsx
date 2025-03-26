"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material"; // Report icon
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Block, State } from "@/db/db";
import { Result } from "@/types";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface RecentServiceProps {
    states: State[];
    coreIndex: number;
}

interface ServiceListItemProps {
    result: Result;
    createdAt: number;
}

function ServiceListItem({result, createdAt}: ServiceListItemProps) {
    return (
      <Link
        key={result.service_id}
        href={`/service/${result.service_id}/`}
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
              service id  {result.service_id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {Math.floor((Date.now() - createdAt) / 1000)} seconds ago
            </Typography>
          </Box>
  
          {/* Right: truncated header hash */}
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{ color: "#1976d2" }}
            >
              { result.result.ok ? 
                <CheckCircleIcon color='success'></CheckCircleIcon> 
                : <ErrorIcon color='error'></ErrorIcon> }
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

export function RecentServices({states, coreIndex}: RecentServiceProps) {
  const displayStates = states.slice(0, 8);
  const workResults = () => {
    let results: { item: Result; createdAt: number | undefined; }[] = [];
    displayStates.forEach((state) => {
      state.rho.forEach((rhoItem) => {
        if (rhoItem?.report.core_index === coreIndex) {
          rhoItem.report.results.forEach((item) => {
            results.push({item, createdAt: state.overview?.createdAt});
          })
        }
      })
    })
    return results;
  }

  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 2, px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Recent Services
      </Typography>

        {(displayStates && displayStates.length > 0) ? 
            (workResults().map((result, resultIndex) => {
                return (
                  <ServiceListItem
                    key={resultIndex}
                    result={result.item}
                    createdAt={result.createdAt || 0}
                  ></ServiceListItem>
                );
            })) : 
            (<Typography
                        variant="subtitle2"
                        sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                No recent services
            </Typography>)}
    </Paper>
  );
}
