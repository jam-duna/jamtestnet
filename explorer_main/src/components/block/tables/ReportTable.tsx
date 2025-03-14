"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
  Link as MuiLink,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";
import {
  Report,
  Context,
  PackageSpec,
  Result,
  SegmentRootLookup,
} from "@/types"; // adjust the import path as needed
import { LabeledRow } from "@/components/display/LabeledRow";
import { workReportMapping } from "@/utils/tooltipDetails"; // adjust the import path
import ToggleHash from "../ToggleHashText";

// Display Context information.
export function ContextDisplay({ context }: { context: Context }) {
  return (
    <Box>
      <LabeledRow
        label={workReportMapping.context[0].label}
        tooltip={workReportMapping.context[0].tooltip}
        value={<ToggleHash hash={context.anchor} />}
      />
      <LabeledRow
        label={workReportMapping.context[1].label}
        tooltip={workReportMapping.context[1].tooltip}
        value={<ToggleHash hash={context.state_root} />}
      />
      <LabeledRow
        label={workReportMapping.context[2].label}
        tooltip={workReportMapping.context[2].tooltip}
        value={<ToggleHash hash={context.beefy_root} />}
      />
      <LabeledRow
        label={workReportMapping.context[3].label}
        tooltip={workReportMapping.context[3].tooltip}
        value={<ToggleHash hash={context.lookup_anchor} />}
      />
      <LabeledRow
        label={workReportMapping.context[4].label}
        tooltip={workReportMapping.context[4].tooltip}
        value={context.lookup_anchor_slot.toString()}
      />
      {context.prerequisites && context.prerequisites.length > 0 && (
        <LabeledRow
          label={workReportMapping.context[5].label}
          tooltip={workReportMapping.context[5].tooltip}
          value={context.prerequisites.join(", ")}
        />
      )}
    </Box>
  );
}

// Display PackageSpec information. We now accept headerHash as a prop.
interface PackageSpecDisplayProps {
  packageSpec: PackageSpec;
  headerHash: string;
}

function PackageSpecDisplay({
  packageSpec,
  headerHash,
}: PackageSpecDisplayProps) {
  const router = useRouter();

  const handleWorkReportRedirect = () => {
    // packageSpec.hash is our workPackageHash.
    router.push(`/block/${headerHash}/workReport/${packageSpec.hash}`);
  };

  return (
    <Box>
      <LabeledRow
        label="Hash"
        tooltip="Package hash"
        value={
          <MuiLink
            onClick={handleWorkReportRedirect}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            <ToggleHash hash={packageSpec.hash} />
          </MuiLink>
        }
      />
      <LabeledRow
        label={workReportMapping.packageSpec[1].label}
        tooltip={workReportMapping.packageSpec[1].tooltip}
        value={packageSpec.length.toString()}
      />
      <LabeledRow
        label={workReportMapping.packageSpec[2].label}
        tooltip={workReportMapping.packageSpec[2].tooltip}
        value={<ToggleHash hash={packageSpec.erasure_root} />}
      />
      <LabeledRow
        label={workReportMapping.packageSpec[3].label}
        tooltip={workReportMapping.packageSpec[3].tooltip}
        value={<ToggleHash hash={packageSpec.exports_root} />}
      />
      <LabeledRow
        label={workReportMapping.packageSpec[4].label}
        tooltip={workReportMapping.packageSpec[4].tooltip}
        value={packageSpec.exports_count.toString()}
      />
    </Box>
  );
}

// Display a single Result.
function ResultDisplay({ result, index }: { result: Result; index: number }) {
  const router = useRouter();

  const handleServiceRedirect = () => {
    router.push(`/service/${result.service_id}`);
  };

  return (
    <Box sx={{ borderBottom: "3px solid #eee", borderRadius: 1, p: 1, mb: 1 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Result {index}
      </Typography>
      <LabeledRow
        label="Service ID"
        tooltip="Service ID"
        value={
          <MuiLink
            onClick={handleServiceRedirect}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {result.service_id.toString()}
          </MuiLink>
        }
      />
      <LabeledRow
        label="Code Hash"
        tooltip="Code Hash"
        value={<ToggleHash hash={result.code_hash} />}
      />
      <LabeledRow
        label="Payload Hash"
        tooltip="Payload Hash"
        value={<ToggleHash hash={result.payload_hash} />}
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
        <ResultDisplay key={idx} result={result} index={idx} />
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
            value={<ToggleHash hash={lookup.segment_tree_root} />}
          />
          <LabeledRow
            label="Work Package Hash"
            tooltip="Work Package Hash"
            value={<ToggleHash hash={lookup.work_package_hash} />}
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
  headerHash: string; // Pass headerHash so we can use it for redirection.
}

export default function ReportTable({
  data,
  idx,
  timeout,
  headerHash,
}: ReportTableProps) {
  // Reusable custom AccordionSummary style
  const customAccordionSummary = (title: string, tooltipText: string) => (
    <AccordionSummary
      sx={{
        px: 0,
        py: 0.75,
        minHeight: "auto",
        "& .MuiAccordionSummary-content": { m: 0, p: 0 },
        cursor: "default",
      }}
      expandIcon={<ExpandMoreIcon />}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Tooltip title={tooltipText} sx={{ ml: 0.5, mr: 1.5 }}>
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "nowrap", minWidth: "170px" }}
        >
          {title}
        </Typography>
      </Box>
    </AccordionSummary>
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {timeout ? (
          <Typography variant="body1">
            Report {idx} - Timeout {timeout}
          </Typography>
        ) : (
          <Typography variant="body1">Report {idx}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {/* Simple fields using workReportMapping for authorization and basicInfo */}
        <LabeledRow
          label={workReportMapping.authorization[1].label}
          tooltip={workReportMapping.authorization[1].tooltip}
          value={data.auth_output}
        />
        <LabeledRow
          label={workReportMapping.authorization[0].label}
          tooltip={workReportMapping.authorization[0].tooltip}
          value={<ToggleHash hash={data.authorizer_hash} />}
        />
        <LabeledRow
          label={workReportMapping.basicInfo[3].label}
          tooltip={workReportMapping.basicInfo[3].tooltip}
          value={data.core_index.toString()}
        />

        {/* Sub-accordion for Context */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mt: 2,
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary("Context", "Context details")}
          <AccordionDetails sx={{ px: 0 }}>
            <ContextDisplay context={data.context} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Package Spec */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary(
            "Package Spec",
            "Package specification details"
          )}
          <AccordionDetails sx={{ px: 0 }}>
            <PackageSpecDisplay
              packageSpec={data.package_spec}
              headerHash={headerHash}
            />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Results */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary("Results", "Results details")}
          <AccordionDetails sx={{ px: 0 }}>
            <ResultsDisplay results={data.results} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Segment Root Lookup */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            px: 0,
          }}
        >
          {customAccordionSummary(
            "Segment Root Lookup",
            "Segment root lookup details"
          )}
          <AccordionDetails sx={{ px: 0 }}>
            <SegmentRootLookupDisplay lookups={data.segment_root_lookup} />
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
}
