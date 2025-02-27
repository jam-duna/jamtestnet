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
import TicketItem from "./TicketItem"; // adjust path accordingly
import AccordionSubsection from "./AccordionSubsection";
import { Extrinsic } from "@/types";

export interface ExtrinsicAccordionProps extends Extrinsic {
  /**
   * If true, the main accordion is expanded on initial load.
   * Defaults to false (closed).
   */
  initialExtrinsicExpanded?: boolean;
}

export default function ExtrinsicAccordion({
  tickets,
  disputes,
  assurances,
  guarantees,
  preimages,
  initialExtrinsicExpanded = false,
}: ExtrinsicAccordionProps) {
  const ticketsCount = tickets?.length || 0;
  const disputesCount = disputes
    ? (disputes.verdicts?.length || 0) +
      (disputes.culprits?.length || 0) +
      (disputes.faults?.length || 0)
    : 0;
  const assurancesCount = assurances?.length || 0;
  const guaranteesCount = guarantees?.length || 0;
  const preimagesCount = preimages?.length || 0;
  const totalExtrinsics =
    ticketsCount +
    disputesCount +
    assurancesCount +
    guaranteesCount +
    preimagesCount;
  const tooltip = `This block contains ${totalExtrinsics} extrinsic event${
    totalExtrinsics !== 1 ? "s" : ""
  }.`;

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
          <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
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
              {totalExtrinsics} extrinsic event
              {totalExtrinsics !== 1 ? "s" : ""}
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
            <Typography key={idx} variant="body2">
              {JSON.stringify(assurance)}
            </Typography>
          ))}
        </AccordionSubsection>

        <AccordionSubsection
          title="Guarantees"
          count={guaranteesCount}
          emptyMessage="No guarantees"
        >
          {guarantees.map((guarantee, idx) => (
            <Typography key={idx} variant="body2">
              Guarantee {idx + 1}:{" "}
              {JSON.stringify(guarantee.report.package_spec)}
            </Typography>
          ))}
        </AccordionSubsection>

        <AccordionSubsection
          title="Preimages"
          count={preimagesCount}
          emptyMessage="No preimages"
        >
          {preimages.map((preimage, idx) => (
            <Typography key={idx} variant="body2">
              Preimage {idx + 1}: {JSON.stringify(preimage)}
            </Typography>
          ))}
        </AccordionSubsection>
      </AccordionDetails>
    </Accordion>
  );
}
