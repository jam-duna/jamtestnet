"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import { LabeledRow } from "../../../../../components/details/LabeledRow"; // adjust the import path as needed
import { db, BlockRecord } from "../../../../../../db";
import { Guarantee } from "@/types";

export default function WorkReportDetailPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;
  const workReportHash = params.workReportHash as string;

  const [workReport, setWorkReport] = useState<Guarantee | null>(null);

  useEffect(() => {
    if (headerHash && workReportHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record: BlockRecord | undefined) => {
          if (record && record.block && record.block.extrinsic) {
            const reports = record.block.extrinsic.guarantees || [];
            const found = reports.find(
              (r: Guarantee) => r.report.package_spec.hash === workReportHash
            );
            setWorkReport(found);
            console.log(record);
          }
        })
        .catch((error) => {
          console.error("Error loading work report:", error);
        });
    }
  }, [headerHash, workReportHash]);

  if (!workReport) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Work Report Details
          </Typography>
          <Typography variant="body1">
            Loading work report details...
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Extract top-level fields from the work report.
  const { report, slot, signatures } = workReport;
  const {
    package_spec,
    context,
    core_index,
    authorizer_hash,
    auth_output,
    // segment_root_lookup,
    // results,
  } = report;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Work Report Details
        </Typography>

        {/* SECTION 1: Basic Info */}
        <Typography variant="h6" gutterBottom>
          Basic Info
        </Typography>
        <LabeledRow
          label="Work Report Hash:"
          tooltip="Unique identifier of the work report derived from the package specification."
          value={package_spec.hash}
        />
        <LabeledRow
          label="Header Hash:"
          tooltip="Block header hash. Click to view block details."
          value={
            <MuiLink
              href={`/block/${headerHash}`}
              sx={{ textDecoration: "underline" }}
            >
              {headerHash}
            </MuiLink>
          }
        />
        <LabeledRow
          label="Slot:"
          tooltip="Slot number for the work report's block."
          value={slot ?? "N/A"}
        />
        <LabeledRow
          label="Core Index:"
          tooltip="Index of the core that processed the work report."
          value={core_index ?? "N/A"}
        />

        <Divider sx={{ my: 2 }} />

        {/* SECTION 2: Package Spec */}
        <Typography variant="h6" gutterBottom>
          Package Spec
        </Typography>
        <LabeledRow
          label="Length:"
          tooltip="Length of the package spec in bytes."
          value={package_spec.length ?? "N/A"}
        />
        <LabeledRow
          label="Erasure Root:"
          tooltip="Erasure root hash for data recovery."
          value={package_spec.erasure_root}
        />
        <LabeledRow
          label="Exports Root:"
          tooltip="Exports root hash for the package."
          value={package_spec.exports_root}
        />
        <LabeledRow
          label="Exports Count:"
          tooltip="Number of exports available in the package spec."
          value={package_spec.exports_count}
        />

        <Divider sx={{ my: 2 }} />

        {/* SECTION 3: Context */}
        <Typography variant="h6" gutterBottom>
          Context
        </Typography>
        <LabeledRow
          label="Anchor:"
          tooltip="Context anchor used to tie the state data."
          value={context.anchor}
        />
        <LabeledRow
          label="State Root:"
          tooltip="Root hash of the block's state."
          value={context.state_root}
        />
        <LabeledRow
          label="Beefy Root:"
          tooltip="Beefy consensus protocol root hash."
          value={context.beefy_root}
        />
        <LabeledRow
          label="Lookup Anchor:"
          tooltip="Anchor used for lookup operations."
          value={context.lookup_anchor}
        />
        <LabeledRow
          label="Lookup Anchor Slot:"
          tooltip="Slot corresponding to the lookup anchor."
          value={context.lookup_anchor_slot}
        />
        <LabeledRow
          label="Prerequisites:"
          tooltip="List of prerequisite hashes required for context."
          value={
            context.prerequisites && context.prerequisites.length > 0
              ? context.prerequisites.map((p: string, idx: number) => (
                  <Typography key={idx} variant="body2">
                    {p}
                  </Typography>
                ))
              : "None"
          }
        />

        <Divider sx={{ my: 2 }} />

        {/* SECTION 4: Authorization */}
        <Typography variant="h6" gutterBottom>
          Authorization
        </Typography>
        <LabeledRow
          label="Authorizer Hash:"
          tooltip="Hash of the entity that authorized this work report."
          value={authorizer_hash}
        />
        <LabeledRow
          label="Auth Output:"
          tooltip="Output generated by the authorization process."
          value={auth_output || "0x"}
        />
        {/*
        <LabeledRow
          label="Segment Root Lookup:"
          tooltip="Values used for segment root lookup."
          value={
            segment_root_lookup && segment_root_lookup.length > 0
              ? segment_root_lookup.map((lookup: unknown, idx: number) => (
                  <Typography key={idx} variant="body2">
                    {lookup}
                  </Typography>
                ))
              : "None"
          }
        />
        */}

        <Divider sx={{ my: 2 }} />

        {/*
       
        <Typography variant="h6" gutterBottom>
          Results
        </Typography>
        {results && results.length > 0 ? (
          results.map((res: any, idx: number) => {
            const {
              service_id,
              code_hash,
              payload_hash,
              accumulate_gas,
              // result,
            } = res;
            return (
              <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <LabeledRow
                  label="Service ID:"
                  tooltip="Service identifier for the execution."
                  value={service_id}
                />
                <LabeledRow
                  label="Code Hash:"
                  tooltip="Hash of the executed code."
                  value={code_hash}
                />
                <LabeledRow
                  label="Payload Hash:"
                  tooltip="Hash of the payload data."
                  value={payload_hash}
                />
                <LabeledRow
                  label="Accumulate Gas:"
                  tooltip="Total gas accumulated during execution."
                  value={accumulate_gas}
                />
               
                <LabeledRow
                  label="Result OK:"
                  tooltip="Successful execution result value."
                  value={result?.ok || "N/A"}
                />
                
              </Paper>
            );
          })
        ) : (
          <Typography>No results found.</Typography>
        )}
        */}

        <Divider sx={{ my: 2 }} />

        {/* SECTION 6: Signatures */}
        <Typography variant="h6" gutterBottom>
          Signatures
        </Typography>
        {signatures && signatures.length > 0 ? (
          signatures.map(
            (
              sig: {
                validator_index: number;
                signature: string;
              },
              idx: number
            ) => (
              <LabeledRow
                key={idx}
                label={`Validator ${sig.validator_index}:`}
                tooltip="Validator signature for this work report."
                value={sig.signature}
              />
            )
          )
        ) : (
          <Typography>No signatures found.</Typography>
        )}
      </Paper>
    </Container>
  );
}
