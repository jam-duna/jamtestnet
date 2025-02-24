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
  labelWidth = 200,
}: LabeledRowProps) {
  return (
    <Box sx={{ display: "flex", mb: 1 }}>
      {/* Fixed-width label + tooltip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: labelWidth,
          maxWidth: labelWidth,
          flexShrink: 0,
        }}
      >
        <Tooltip title={tooltip}>
          <IconButton size="small" sx={{ mr: 0.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap", // keep the label on one line
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Value area (wraps text) */}
      <Box
        sx={{
          flex: 1,
          ml: 1,
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Box>
  );
}
