"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface AccordionSubsectionProps {
  title: string;
  count: number;
  emptyMessage: string;
  children: React.ReactNode;
}

export default function AccordionSubsection({
  title,
  count,
  emptyMessage,
  children,
}: AccordionSubsectionProps) {
  return (
    <Accordion
      disableGutters
      sx={{
        py: 1,
        border: "none",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          py: 0,
          minHeight: "auto",
          "& .MuiAccordionSummary-content": { m: 0, p: 0 },
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={`${title} details`}>
            <IconButton size="small" sx={{ mr: 1 }} component="span">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1">
            {title} ({count})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 5, m: 0 }}>
        {count > 0 ? (
          children
        ) : (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2">{emptyMessage}</Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
