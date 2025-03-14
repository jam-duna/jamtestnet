import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Typography, { TypographyProps } from "@mui/material/Typography";

interface LabeledRowProps {
  label: string;
  tooltip: string;
  value: React.ReactNode;
  labelWidth?: number;
  mb?: number;
  labelVariant?: TypographyProps["variant"];
}

export function LabeledRow({
  label,
  tooltip,
  value,
  labelWidth = 200,
  labelVariant = "body1",
  mb = 1,
}: LabeledRowProps) {
  return (
    <Box sx={{ display: "flex", mb: mb }}>
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
          <IconButton size="small" sx={{ mr: 1 }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant={labelVariant}
          sx={{
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
          alignSelf: "center",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}
