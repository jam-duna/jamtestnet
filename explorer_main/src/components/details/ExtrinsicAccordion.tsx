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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface ExtrinsicAccordionProps {
  tickets: any[];
  disputes: {
    verdicts: any[];
    culprits: any[];
    faults: any[];
  } | null;
  assurances: any[];
  guarantees: any[];
  preimages: any[];
}

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

  return (
    <Accordion sx={{ mt: 5 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          Extrinsic Count: {totalExtrinsics} extrinsic event
          {totalExtrinsics !== 1 ? "s" : ""} in this block
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AccordionSubSection title="Tickets" count={ticketsCount}>
          {ticketsCount > 0 ? (
            tickets.map((ticket, idx) => (
              <Typography key={idx} variant="body2">
                Ticket {idx + 1}: {JSON.stringify(ticket)}
              </Typography>
            ))
          ) : (
            <Typography variant="body2">No tickets</Typography>
          )}
        </AccordionSubSection>

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
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={`${title} details`}>
            <IconButton size="small" sx={{ ml: 1 }} component="span">
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography>
            {title} ({count})
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
