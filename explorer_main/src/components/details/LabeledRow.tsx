import React from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface LabeledRowProps {
  label: string;
  tooltip: string;
  value: React.ReactNode;
  labelWidth?: number; // optional custom width
}

export function LabeledRow({
  label,
  tooltip,
  value,
  labelWidth = 150,
}: LabeledRowProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      {/* Label & Tooltip */}
      <Box sx={{ display: "flex", alignItems: "center", width: labelWidth }}>
        <Tooltip title={tooltip}>
          <IconButton size="small" sx={{ mr: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      </Box>
      {/* Value */}
      <Typography variant="body1" sx={{ ml: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}
