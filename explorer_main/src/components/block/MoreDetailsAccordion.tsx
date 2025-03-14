"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LabeledRow } from "@/components/display/LabeledRow"; // Adjust path as needed
import { moreDetailsMapping } from "@/utils/tooltipDetails";

interface HeaderProps {
  parent: string;
  parent_state_root: string;
  seal: string;
  entropy_source: string;
}

interface MoreDetailsAccordionProps {
  header: HeaderProps;
}

export default function MoreDetailsAccordion({
  header,
}: MoreDetailsAccordionProps) {
  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1" sx={{ px: 2 }}>
          More Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3 }}>
        {Object.entries(moreDetailsMapping).map(([key, { label, tooltip }]) => (
          <LabeledRow
            key={key}
            label={label}
            tooltip={tooltip}
            value={
              <Typography variant="body1">
                {header[key as keyof HeaderProps]}
              </Typography>
            }
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
