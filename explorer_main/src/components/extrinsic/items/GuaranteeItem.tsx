"use client";

import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import { Report, GuaranteeSignature } from "@/types/index";

interface Guarantee {
  report: Report;
  slot: number;
  signatures: GuaranteeSignature[];
}

interface GuaranteeItemProps {
  guarantee: Guarantee;
  idx: number;
  expanded: boolean;
  headerHash: string;
}

export default function GuaranteeItem({
  guarantee,
  idx,
  headerHash,
}: GuaranteeItemProps) {
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
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary sx={{ p: 0 }}>
          <Typography variant="body2">Guarantee {idx}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, pb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Work Report:{" "}
            <MuiLink
              component={Link}
              href={`/block/${headerHash}/workReport/${guarantee.report.package_spec.hash}`}
              sx={{ textDecoration: "underline" }}
            >
              {guarantee.report.package_spec.hash}
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Slot: {guarantee.slot}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Signatures:
          </Typography>
          {guarantee.signatures.map((sig, i) => (
            <Typography
              key={`signature-${i}`}
              variant="body2"
              color="textSecondary"
              sx={{ ml: 2 }}
              gutterBottom
            >
              Validator {sig.validator_index}: {sig.signature}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
