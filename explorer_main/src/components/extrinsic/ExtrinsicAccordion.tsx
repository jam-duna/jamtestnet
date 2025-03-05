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
  Link as MuiLink,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TicketItem from "./items/TicketItem"; // adjust path accordingly
import AccordionSubsection from "./AccordionSubsection";
import { Extrinsic } from "@/types";
import PreimageItem from "./items/PreimageItem";
import AssurancesItem from "./items/AssuranceItem";
import GuaranteeItem from "./items/GuaranteeItem";
import { calculateExtrinsicCounts } from "@/utils/extrinsics";
import { pluralize } from "@/utils/helper";

export interface ExtrinsicAccordionProps {
  initialExtrinsicExpanded?: boolean;
  headerHash: string;
  extrinsic: Extrinsic;
}

export default function ExtrinsicAccordion({
  extrinsic,
  headerHash,
  initialExtrinsicExpanded = false,
}: ExtrinsicAccordionProps) {
  const { tickets, disputes, assurances, preimages, guarantees } = extrinsic;

  const {
    ticketsCount,
    disputesCount,
    assurancesCount,
    guaranteesCount,
    preimagesCount,
    totalExtrinsics,
  } = calculateExtrinsicCounts(extrinsic);

  const tooltip = `This block contains ${totalExtrinsics} ${pluralize(
    "extrinsic",
    totalExtrinsics
  )}`;

  // Main accordion expansion state.
  const [extrinsicExpanded, setExtrinsicExpanded] = React.useState<boolean>(
    initialExtrinsicExpanded
  );

  return (
    <Accordion
      disableGutters
      expanded={extrinsicExpanded}
      onChange={(_, isExpanded) => setExtrinsicExpanded(isExpanded)}
      sx={{
        border: "none",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          minHeight: "auto",
          "& .MuiAccordionSummary-content": { m: 0, p: 0 },
          cursor: "default",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Tooltip title={tooltip} sx={{ ml: 0.5, mr: 1.5 }}>
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "nowrap", minWidth: "170px" }}
          >
            Extrinsic Count:
          </Typography>
          <MuiLink
            href="#"
            onClick={(e) => e.preventDefault()}
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            <Typography variant="body1">
              {totalExtrinsics} {pluralize("extrinsic", totalExtrinsics)}
            </Typography>
          </MuiLink>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ mt: 1, p: 0, pl: 26 }}>
        <AccordionSubsection
          title="Tickets"
          count={ticketsCount}
          emptyMessage="No tickets"
        >
          {tickets.map((ticket, idx) => (
            <TicketItem
              key={idx}
              ticket={ticket}
              idx={idx}
              expanded={extrinsicExpanded}
            />
          ))}
        </AccordionSubsection>

        <AccordionSubsection
          title="Disputes"
          count={disputesCount}
          emptyMessage="No disputes"
        >
          <>
            <Typography variant="body2">
              Verdicts: {disputes?.verdicts?.length || 0}
            </Typography>
            <Typography variant="body2">
              Culprits: {disputes?.culprits?.length || 0}
            </Typography>
            <Typography variant="body2">
              Faults: {disputes?.faults?.length || 0}
            </Typography>
          </>
        </AccordionSubsection>

        <AccordionSubsection
          title="Assurances"
          count={assurancesCount}
          emptyMessage="No assurances"
        >
          {assurances.map((assurance, idx) => (
            <AssurancesItem
              key={idx}
              assurances={assurance}
              idx={idx}
              expanded={extrinsicExpanded}
            />
          ))}
        </AccordionSubsection>

        <AccordionSubsection
          title="Guarantees"
          count={guaranteesCount}
          emptyMessage="No guarantees"
        >
          {guarantees.map((guarantee, idx) => (
            <GuaranteeItem
              key={idx}
              guarantee={guarantee}
              headerHash={headerHash}
              idx={idx}
              expanded={extrinsicExpanded}
            />
          ))}
        </AccordionSubsection>

        <AccordionSubsection
          title="Preimages"
          count={preimagesCount}
          emptyMessage="No preimages"
        >
          {preimages.map((preimage, idx) => (
            <PreimageItem
              key={idx}
              preimage={preimage}
              idx={idx}
              expanded={extrinsicExpanded}
            />
          ))}
        </AccordionSubsection>
      </AccordionDetails>
    </Accordion>
  );
}
