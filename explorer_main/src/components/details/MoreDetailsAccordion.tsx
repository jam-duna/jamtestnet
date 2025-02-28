"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LabeledRow } from "./LabeledRow"; // Adjust path as needed

interface HeaderProps {
  parent: string;
  parent_state_root: string;
  seal: string;
  entropy_source: string;
}

interface MoreDetailsAccordionProps {
  header: HeaderProps;
}

// Mapping for header details (label and tooltip for each field)
const headerDetailsMapping: Record<
  keyof HeaderProps,
  { label: string; tooltip: string }
> = {
  parent: {
    label: "Parent:",
    tooltip: "Hash of the previous block in the chain.",
  },
  parent_state_root: {
    label: "Parent State Root:",
    tooltip: "Merkle root summarizing the entire state after the parent block.",
  },
  seal: {
    label: "Seal:",
    tooltip:
      "A cryptographic seal containing the block producer's signature and possibly VRF data.",
  },
  entropy_source: {
    label: "Entropy Source:",
    tooltip:
      "Used to provide randomness for the protocol. Typically not crucial for end-users.",
  },
};

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
        {Object.entries(headerDetailsMapping).map(
          ([key, { label, tooltip }]) => (
            <LabeledRow
              key={key}
              label={label}
              tooltip={tooltip}
              value={header[key as keyof HeaderProps]}
            />
          )
        )}
      </AccordionDetails>
    </Accordion>
  );
}
