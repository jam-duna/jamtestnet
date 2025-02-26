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
import AccordionSubSection from "@/components/details/AccordionSubsection";
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

      <AccordionDetails sx={{ mt: 1, p: 0, ml: 26 }}>
        <AccordionSubSection title="Tickets" count={ticketsCount}>
          {ticketsCount > 0 ? (
            tickets.map((ticket, idx) => (
              <TicketItem
                key={idx}
                ticket={ticket}
                idx={idx}
                expanded={extrinsicExpanded}
              />
            ))
          ) : (
            <Typography variant="body2">No tickets</Typography>
          )}
        </AccordionSubSection>

        <AccordionSubSection title="Disputes" count={disputesCount}>
          {disputesCount > 0 ? (
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
          ) : (
            <Typography variant="body2">No disputes</Typography>
          )}
        </AccordionSubSection>

        <AccordionSubSection title="Assurances" count={assurancesCount}>
          {assurancesCount > 0 ? (
            assurances.map((assurance, idx) => (
              <Typography key={idx} variant="body2">
                {JSON.stringify(assurance)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No assurances</Typography>
          )}
        </AccordionSubSection>

        <AccordionSubSection title="Guarantees" count={guaranteesCount}>
          {guaranteesCount > 0 ? (
            guarantees.map((guarantee, idx) => (
              <Typography key={idx} variant="body2">
                Guarantee {idx + 1}:{" "}
                {JSON.stringify(guarantee.report.package_spec)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No guarantees</Typography>
          )}
        </AccordionSubSection>

        <AccordionSubSection title="Preimages" count={preimagesCount}>
          {preimagesCount > 0 ? (
            preimages.map((preimage, idx) => (
              <Typography key={idx} variant="body2">
                Preimage {idx + 1}: {JSON.stringify(preimage)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No preimages</Typography>
          )}
        </AccordionSubSection>
      </AccordionDetails>
    </Accordion>
  );
}
