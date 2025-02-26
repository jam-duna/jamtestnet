/*
"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface KeyValueDisplayProps {
  data: Record<string, any>;
}

export function KeyValueDisplay({ data }: KeyValueDisplayProps) {
  return (
    <Box sx={{ ml: 2 }}>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key} sx={{ display: "flex", mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
            {key}:
          </Typography>
          <Typography variant="body2">
            {typeof value === "object" && value !== null
              ? // If the value is an object, you can either recursively render it
                // or simply JSON.stringify with some formatting.
                JSON.stringify(value, null, 2)
              : String(value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

*/
