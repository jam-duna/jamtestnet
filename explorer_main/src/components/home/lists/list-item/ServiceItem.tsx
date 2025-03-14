"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { truncateHash } from "@/utils/helper";

export interface ServiceListItemProps {
  serviceItem: {
    code_hash: string;
    balance: number;
    min_item_gas: number;
    min_memo_gas: number;
    bytes: number;
    items: number;
  };
}

export default function ServiceListItem({ serviceItem }: ServiceListItemProps) {
  const { code_hash, balance, min_item_gas, min_memo_gas, bytes, items } =
    serviceItem;
  const shortHash = truncateHash(code_hash);

  return (
    <Link
      href={`/service/${code_hash}`}
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
        {/* Left Icon */}
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
          <CropSquareIcon fontSize="small" />
        </Box>

        {/* Middle: Service Details */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">Balance: {balance}</Typography>
          <Typography variant="body2" color="textSecondary">
            min_item_gas: {min_item_gas} | min_memo_gas: {min_memo_gas}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Bytes: {bytes} | Items: {items}
          </Typography>
        </Box>

        {/* Right: Truncated Code Hash */}
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", textDecoration: "underline" }}
          >
            {shortHash}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            code hash
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}
