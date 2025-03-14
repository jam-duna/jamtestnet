"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow"; // adjust the import path as needed
import { db, Block, State } from "@/db/db";
import { Guarantee } from "@/types";
import { workReportMapping } from "@/utils/tooltipDetails"; // Import the new mapping bundle
import { useWorkReportStatuses } from "@/hooks/workReport/useWorkReportStatuses";

export default function WorkReportDetailPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;
  const workReportHash = params.workPackageHash as string;
  const router = useRouter();

  const [workReport, setWorkReport] = useState<Guarantee | null>(null);
  const [blockRecord, setBlockRecord] = useState<Block | null>(null);
  const [stateRecord, setStateRecord] = useState<State | null>(null);

  // Fetch block record (to extract current slot) based on headerHash.
  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("overview.headerHash")
        .equals(headerHash)
        .first()
        .then((record: Block | undefined) => {
          if (record) {
            setBlockRecord(record);
          }
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  // Fetch state record from DB (if needed elsewhere).
  useEffect(() => {
    if (headerHash) {
      db.states
        .where("overview.headerHash")
        .equals(headerHash)
        .first()
        .then((record: State | undefined) => {
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }
  }, [headerHash]);

  // Fetch the work report from the current block's guarantees.
  useEffect(() => {
    if (headerHash && workReportHash) {
      db.blocks
        .where("overview.headerHash")
        .equals(headerHash)
        .first()
        .then((record: Block | undefined) => {
          if (record && record.header && record.extrinsic) {
            const reports = record.extrinsic.guarantees || [];
            const found = reports.find(
              (r: Guarantee) => r.report.package_spec.hash === workReportHash
            );
            setWorkReport(found ?? null);
          }
        })
        .catch((error) => {
          console.error("Error loading work report:", error);
        });
    }
  }, [headerHash, workReportHash]);

  // Use the custom hook to get the status for the single work report.
  // const reportHash = workReport?.report?.package_spec?.hash;
  const reportHashArray = useMemo(
    () => (workReportHash ? [workReportHash] : []),
    [workReportHash]
  );
  const currentSlot = blockRecord?.overview?.slot || 0;
  const statuses = useWorkReportStatuses(reportHashArray, currentSlot);

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

  // Destructure fields from the work report.
  const { report, slot, signatures } = workReport;
  const { package_spec, context, core_index, authorizer_hash, auth_output } =
    report;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Work Report Details
      </Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        {/* SECTION 1: Basic Info */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Info
        </Typography>
        {workReportMapping.basicInfo.map((item, idx) => (
          <LabeledRow
            key={idx}
            label={item.label}
            tooltip={item.tooltip}
            value={
              item.label === "Header Hash:" ? (
                <MuiLink
                  href={`/block/${headerHash}?type=headerHash`}
                  sx={{ textDecoration: "underline" }}
                >
                  {headerHash}
                </MuiLink>
              ) : item.label === "Slot:" ? (
                slot ?? "N/A"
              ) : item.label === "Core Index:" ? (
                core_index ?? "N/A"
              ) : item.label === "Report Status:" ? (
                statuses[package_spec.hash] || "N/A"
              ) : (
                package_spec.hash
              )
            }
          />
        ))}
        <Divider sx={{ my: 2 }} />

        {/* SECTION 2: Package Spec */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Package Spec
        </Typography>
        {workReportMapping.packageSpec.map((item, idx) => (
          <LabeledRow
            key={idx}
            label={item.label}
            tooltip={item.tooltip}
            value={
              item.label === "Length:"
                ? package_spec.length ?? "N/A"
                : item.label === "Erasure Root:"
                ? package_spec.erasure_root
                : item.label === "Exports Root:"
                ? package_spec.exports_root
                : item.label === "Exports Count:"
                ? package_spec.exports_count
                : package_spec.hash
            }
          />
        ))}
        <Divider sx={{ my: 2 }} />

        {/* SECTION 3: Context */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Context
        </Typography>
        {workReportMapping.context.map((item, idx) => (
          <LabeledRow
            key={idx}
            label={item.label}
            tooltip={item.tooltip}
            value={
              item.label === "Anchor:"
                ? context.anchor
                : item.label === "State Root:"
                ? context.state_root
                : item.label === "Beefy Root:"
                ? context.beefy_root
                : item.label === "Lookup Anchor:"
                ? context.lookup_anchor
                : item.label === "Lookup Anchor Slot:"
                ? context.lookup_anchor_slot
                : item.label === "Prerequisites:"
                ? context.prerequisites && context.prerequisites.length > 0
                  ? context.prerequisites.map((p: string, idx: number) => (
                      <Typography key={idx} variant="body2">
                        {p}
                      </Typography>
                    ))
                  : "None"
                : "N/A"
            }
          />
        ))}
        <Divider sx={{ my: 2 }} />

        {/* SECTION 4: Authorization */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Authorization
        </Typography>
        {workReportMapping.authorization.map((item, idx) => (
          <LabeledRow
            key={idx}
            label={item.label}
            tooltip={item.tooltip}
            value={
              item.label === "Authorizer Hash:"
                ? authorizer_hash
                : item.label === "Auth Output:"
                ? auth_output || "0x"
                : "N/A"
            }
          />
        ))}
        <Divider sx={{ my: 2 }} />

        {/* SECTION 5: Signatures */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Signatures
        </Typography>
        {signatures && signatures.length > 0 ? (
          signatures.map(
            (
              sig: { validator_index: number; signature: string },
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
