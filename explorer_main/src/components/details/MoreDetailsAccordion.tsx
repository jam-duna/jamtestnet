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
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          variant="body1"
          sx={{
            // fontWeight: "bold",
            px: 2,
          }}
        >
          More Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3 }}>
        <LabeledRow
          label="Parent:"
          tooltip="Hash of the previous block in the chain."
          value={header.parent}
        />
        <LabeledRow
          label="Parent State Root:"
          tooltip="Merkle root summarizing the entire state after the parent block."
          value={header.parent_state_root}
        />
        <LabeledRow
          label="Seal:"
          tooltip="A cryptographic seal containing the block producer's signature and possibly VRF data."
          value={header.seal}
        />
        <LabeledRow
          label="Entropy Source:"
          tooltip="Used to provide randomness for the protocol. Typically not crucial for end-users."
          value={header.entropy_source}
        />
      </AccordionDetails>
    </Accordion>
  );
}
