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

interface MoreDetailsAccordionProps {
  header: {
    parent: string;
    parent_state_root: string;
    seal: string;
    entropy_source: string;
  };
}

export default function MoreDetailsAccordion({
  header,
}: MoreDetailsAccordionProps) {
  return (
    <Accordion sx={{ mt: 5 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">More Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <LabeledRow
          label="Parent:"
          tooltip="Hash of the previous block in the chain."
          value={header.parent}
          labelWidth={160}
        />
        <LabeledRow
          label="Parent State Root:"
          tooltip="Merkle root summarizing the entire state after the parent block."
          value={header.parent_state_root}
          labelWidth={160}
        />
        <LabeledRow
          label="Seal:"
          tooltip="A cryptographic seal containing the block producer's signature and possibly VRF data."
          value={header.seal}
          labelWidth={160}
        />
        <LabeledRow
          label="Entropy Source:"
          tooltip="Used to provide randomness for the protocol. Typically not crucial for end-users."
          value={header.entropy_source}
          labelWidth={160}
        />
      </AccordionDetails>
    </Accordion>
  );
}
