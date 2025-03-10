"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { RhoItem } from "@/types";
import ReportTable from "./ReportTable";

interface RhoTableProps {
  data: RhoItem;
}

export default function RhoTable({ data }: RhoTableProps) {
  return (
    <Box sx={{ my: 4 }}>
      {data.map((item, idx) => {
        if (!item) return null;
        const { report, timeout } = item;
        return (
          <Box key={idx} sx={{ mb: 4 }}>
            <Typography variant="h5">Timeout: {timeout}</Typography>
            <Typography variant="h6">Report</Typography>
            <ReportTable data={report} />
          </Box>
        );
      })}
    </Box>
  );
}
