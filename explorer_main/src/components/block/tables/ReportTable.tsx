"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Report,
  Context,
  PackageSpec,
  Result,
  SegmentRootLookup,
} from "@/types"; // adjust the import path as needed
import { LabeledRow } from "@/components/display/LabeledRow";

// Display Context information.
function ContextDisplay({ context }: { context: Context }) {
  return (
    <Box>
      <LabeledRow label="Anchor" tooltip="Anchor" value={context.anchor} />
      <LabeledRow
        label="State Root"
        tooltip="State Root"
        value={context.state_root}
      />
      <LabeledRow
        label="Beefy Root"
        tooltip="Beefy Root"
        value={context.beefy_root}
      />
      <LabeledRow
        label="Lookup Anchor"
        tooltip="Lookup Anchor"
        value={context.lookup_anchor}
      />
      <LabeledRow
        label="Lookup Anchor Slot"
        tooltip="Lookup Anchor Slot"
        value={context.lookup_anchor_slot.toString()}
      />
      {context.prerequisites && context.prerequisites.length > 0 && (
        <LabeledRow
          label="Prerequisites"
          tooltip="Prerequisites"
          value={context.prerequisites.join(", ")}
        />
      )}
    </Box>
  );
}

// Display PackageSpec information.
function PackageSpecDisplay({ packageSpec }: { packageSpec: PackageSpec }) {
  return (
    <Box>
      <LabeledRow
        label="Hash"
        tooltip="Package hash"
        value={packageSpec.hash}
      />
      <LabeledRow
        label="Length"
        tooltip="Package length"
        value={packageSpec.length.toString()}
      />
      <LabeledRow
        label="Erasure Root"
        tooltip="Erasure root"
        value={packageSpec.erasure_root}
      />
      <LabeledRow
        label="Exports Root"
        tooltip="Exports root"
        value={packageSpec.exports_root}
      />
      <LabeledRow
        label="Exports Count"
        tooltip="Exports count"
        value={packageSpec.exports_count.toString()}
      />
    </Box>
  );
}

// Display a single Result.
function ResultDisplay({ result }: { result: Result }) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 1, p: 1, mb: 1 }}>
      <LabeledRow
        label="Service ID"
        tooltip="Service ID"
        value={result.service_id.toString()}
      />
      <LabeledRow
        label="Code Hash"
        tooltip="Code Hash"
        value={result.code_hash}
      />
      <LabeledRow
        label="Payload Hash"
        tooltip="Payload Hash"
        value={result.payload_hash}
      />
      <LabeledRow
        label="Accumulate Gas"
        tooltip="Accumulate Gas"
        value={result.accumulate_gas.toString()}
      />
      <LabeledRow
        label="Result"
        tooltip="Result"
        value={result.result.ok || "N/A"}
      />
    </Box>
  );
}

// Display a list of Results.
function ResultsDisplay({ results }: { results: Result[] }) {
  return (
    <Box>
      {results.map((result, idx) => (
        <ResultDisplay key={idx} result={result} />
      ))}
    </Box>
  );
}

// Display a list of SegmentRootLookup.
function SegmentRootLookupDisplay({
  lookups,
}: {
  lookups: SegmentRootLookup[];
}) {
  return (
    <Box>
      {lookups.map((lookup, idx) => (
        <Box
          key={idx}
          sx={{ border: "1px solid #eee", borderRadius: 1, p: 1, mb: 1 }}
        >
          <LabeledRow
            label="Segment Tree Root"
            tooltip="Segment Tree Root"
            value={lookup.segment_tree_root}
          />
          <LabeledRow
            label="Work Package Hash"
            tooltip="Work Package Hash"
            value={lookup.work_package_hash}
          />
        </Box>
      ))}
    </Box>
  );
}

interface ReportTableProps {
  data: Report;
  idx?: number;
  timeout?: number;
}

export default function ReportTable({ data, idx, timeout }: ReportTableProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">
          Report {idx} - Timeout {timeout}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Simple fields */}
        <LabeledRow
          label="Auth Output"
          tooltip="Authentication output"
          value={data.auth_output}
        />
        <LabeledRow
          label="Authorizer Hash"
          tooltip="Authorizer hash"
          value={data.authorizer_hash}
        />
        <LabeledRow
          label="Core Index"
          tooltip="Core index value"
          value={data.core_index.toString()}
        />

        {/* Sub-accordion for Context */}
        <Accordion sx={{ mt: 2, mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Context</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ContextDisplay context={data.context} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Package Spec */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Package Spec</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PackageSpecDisplay packageSpec={data.package_spec} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Results */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ResultsDisplay results={data.results} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Segment Root Lookup */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Segment Root Lookup</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SegmentRootLookupDisplay lookups={data.segment_root_lookup} />
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
}
