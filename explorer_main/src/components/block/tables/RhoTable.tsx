"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import ReportTable from "./ReportTable";
import { RhoItem } from "@/types";

interface RhoTableProps {
  data: RhoItem;
  headerHash: string;
}

export default function RhoTable({ data, headerHash }: RhoTableProps) {
  const validItems = data.filter((item) => item !== null);

  if (validItems.length === 0) {
    return <Typography variant="body1">No Rho data available.</Typography>;
  }

  return (
    <Box sx={{ my: 4 }}>
      {validItems.map((item, idx) => {
        // TypeScript knows item is not null here.
        const { report, timeout } = item!;
        return (
          <Box key={idx} sx={{ mb: 4 }}>
            <ReportTable
              data={report}
              idx={idx}
              timeout={timeout}
              headerHash={headerHash}
            />
          </Box>
        );
      })}
    </Box>
  );
}
