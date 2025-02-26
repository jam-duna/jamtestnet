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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TicketItem from "./TicketItem"; // adjust path accordingly

// --- Interfaces ---

// Package specification
export interface PackageSpec {
  hash: string;
  length: number;
  erasure_root: string;
  exports_root: string;
  exports_count: number;
}

// Context information
export interface Context {
  anchor: string;
  state_root: string;
  beefy_root: string;
  lookup_anchor: string;
  lookup_anchor_slot: number;
  prerequisites?: string[];
}

// Report structure
export interface Report {
  auth_output: string;
  authorizer_hash: string;
  context: Context;
  core_index: number;
  package_spec: PackageSpec;
  results: Array<{
    service_id: number;
    code_hash: string;
    payload_hash: string;
    accumulate_gas: number;
    result: { ok?: unknown };
  }>;
  segment_root_lookup: any[];
}

// Guarantee signature
export interface GuaranteeSignature {
  signature: string;
  validator_index: number;
}

// Guarantee work report object
export interface GuaranteeObject {
  report: Report;
  signatures: GuaranteeSignature[];
  slot: number;
}

// Ticket interface
export interface Ticket {
  attempt: number;
  signature: string;
}

// Assurance interface
export interface Assurance {
  anchor: string;
  bitfield: string;
  signature: string;
  validator_index: number;
}

// Preimage interface
export interface Preimage {
  blob: string;
  requester: number;
}

// Disputes interface
export interface Disputes {
  verdicts: unknown[];
  culprits: unknown[];
  faults: unknown[];
}

// Extrinsic interface combining all arrays
export interface Extrinsic {
  tickets: Ticket[];
  disputes?: Disputes | null;
  assurances: Assurance[];
  guarantees: GuaranteeObject[];
  preimages: Preimage[];
}

// ExtrinsicAccordionProps defines the props expected by the component.
export interface ExtrinsicAccordionProps {
  tickets: Ticket[];
  disputes?: Disputes | null;
  assurances: Assurance[];
  guarantees: GuaranteeObject[];
  preimages: Preimage[];
}

// --- Component ---

export default function ExtrinsicAccordion({
  tickets,
  disputes,
  assurances,
  guarantees,
  preimages,
}: ExtrinsicAccordionProps) {
  const ticketsCount = tickets ? tickets.length : 0;
  const disputesCount = disputes
    ? (disputes.verdicts ? disputes.verdicts.length : 0) +
      (disputes.culprits ? disputes.culprits.length : 0) +
      (disputes.faults ? disputes.faults.length : 0)
    : 0;
  const assurancesCount = assurances ? assurances.length : 0;
  const guaranteesCount = guarantees ? guarantees.length : 0;
  const preimagesCount = preimages ? preimages.length : 0;
  const totalExtrinsics =
    ticketsCount +
    disputesCount +
    assurancesCount +
    guaranteesCount +
    preimagesCount;
  const tooltip = `This block contains ${totalExtrinsics} extrinsic event${
    totalExtrinsics !== 1 ? "s" : ""
  }.`;
  const labelWidth = "170px";

  // Local state to control expansion of the Tickets sub-accordion.
  const [ticketsExpanded, setTicketsExpanded] = React.useState<boolean>(false);

  return (
    <Accordion
      disableGutters
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "nowrap",
              minWidth: labelWidth,
              maxWidth: labelWidth,
            }}
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
              {totalExtrinsics !== 1 ? "s" : ""} in this block
            </Typography>
          </MuiLink>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ mt: 1, p: 0, pl: 26 }}>
        {/* Tickets sub-accordion */}
        <Accordion
          disableGutters
          expanded={ticketsExpanded}
          onChange={(event, isExpanded) => setTicketsExpanded(isExpanded)}
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
              <Tooltip title="Tickets details">
                <IconButton size="small" sx={{ mr: 1 }} component="span">
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="subtitle1">
                Tickets ({ticketsCount})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, m: 0 }}>
            {ticketsCount > 0 ? (
              tickets.map((ticket, idx) => (
                <TicketItem
                  key={idx}
                  ticket={ticket}
                  idx={idx}
                  expanded={ticketsExpanded}
                />
              ))
            ) : (
              <Typography variant="body2">No tickets</Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Disputes sub-section */}
        <AccordionSubSection title="Disputes" count={disputesCount}>
          {disputes ? (
            <>
              <Typography variant="body2">
                Verdicts: {disputes.verdicts?.length || 0}
              </Typography>
              <Typography variant="body2">
                Culprits: {disputes.culprits?.length || 0}
              </Typography>
              <Typography variant="body2">
                Faults: {disputes.faults?.length || 0}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">No disputes</Typography>
          )}
        </AccordionSubSection>

        {/* Assurances sub-section */}
        <AccordionSubSection title="Assurances" count={assurancesCount}>
          {assurancesCount > 0 ? (
            assurances.map((assurance, idx) => (
              <Typography key={idx} variant="body2">
                Assurance {idx + 1}: {JSON.stringify(assurance)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No assurances</Typography>
          )}
        </AccordionSubSection>

        {/* Guarantees sub-section */}
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

        {/* Preimages sub-section */}
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

interface AccordionSubSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

function AccordionSubSection({
  title,
  count,
  children,
}: AccordionSubSectionProps) {
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
      <AccordionDetails sx={{ px: 5, m: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
}
