"use client";

import React from "react";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material"; // Report icon
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Block, State } from "@/db/db";
import { Result } from "@/types";
import { truncateHash } from "@/utils/helper";
import { PreimageProps } from "@/utils/blockAnalyzer";

function PreimageListItem(data: PreimageProps) {
    const createdAt = data.timestamp;
    const workpackageHash = data.package_hash;
    const preimageHash = data.preimage.blob;
    const preimageSize = data.preimage.blob.length;
  
    return (
      <Link
        key={preimageHash}
        href={`/workpackage/${workpackageHash}/`}
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
              requester {data.preimage.requester}
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
              {truncateHash(preimageHash)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              size {preimageSize}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

interface RecentPreimagesProps {
  preimages: PreimageProps[];
}

export function RecentPreimages(data: RecentPreimagesProps) {
  const displayPreimgs = data.preimages.slice(0, 8);

  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        sx={{ mb: 2, px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Recent Preimages
      </Typography>

        {(displayPreimgs && displayPreimgs.length > 0) ? 
          (displayPreimgs.map((preimg, preimgIndex) => {
            return (
              <PreimageListItem
                key={preimgIndex}
                {...preimg}
              />
            );
          })) : 
          (<Typography
            variant="subtitle2"
            sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
            >
          No recent preimages
          </Typography>)}
    </Paper>
  );
}
