import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";

interface AssurancesItemProps {
  assurances: {
    anchor: string;
    bitfield: string;
    signature: string;
    validator_index: number;
  };
  idx: number;
  expanded: boolean;
}

export default function AssurancesItem({
  assurances,
  idx,
}: AssurancesItemProps) {
  return (
    <Box
      sx={{
        borderTop: "1px solid #ccc",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      <Accordion
        disableGutters
        sx={{
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary sx={{ p: 0 }}>
          <Typography variant="body2">Assurances {idx}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, pb: 2 }}>
          {Object.entries(assurances).map(([key, value]) => (
            <Typography
              key={key}
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              {key}: {value}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
