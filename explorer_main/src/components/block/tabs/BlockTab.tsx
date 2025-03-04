"use client";

import React from "react";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import ExtrinsicAccordion from "@/components/extrinsic/ExtrinsicAccordion";
import MoreDetailsAccordion from "@/components/block/MoreDetailsAccordion";
import BlockNavigationButtons from "@/components/block/BlockNavigationButtons";
import { basicInfoMapping } from "@/utils/tooltipDetails";
import { useRouter } from "next/navigation";
import { pluralize } from "@/utils/helper";

interface BlockTabProps {
  blockRecord: any; // Use your actual BlockRecord type here.
  headerHash: string;
  prevHash: string | null;
  nextHash: string | null;
}

export function BlockTab({
  blockRecord,
  headerHash,
  prevHash,
  nextHash,
}: BlockTabProps) {
  const router = useRouter();
  const block = blockRecord.block;
  const header = block.header;
  const extrinsic = block.extrinsic;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <LabeledRow
          label={basicInfoMapping.blockHeight.label}
          tooltip={basicInfoMapping.blockHeight.tooltip}
          value={
            <BlockNavigationButtons
              slot={header.slot}
              prevHash={prevHash}
              nextHash={nextHash}
              onPrev={() => {
                if (prevHash) router.push(`/block/${prevHash}`);
              }}
              onNext={() => {
                if (nextHash) router.push(`/block/${nextHash}`);
              }}
            />
          }
        />

        <LabeledRow
          label={basicInfoMapping.blockHash.label}
          tooltip={basicInfoMapping.blockHash.tooltip}
          value={blockRecord.overview.blockHash}
        />

        <LabeledRow
          label={basicInfoMapping.headerHash.label}
          tooltip={basicInfoMapping.headerHash.tooltip}
          value={blockRecord.headerHash}
        />

        <LabeledRow
          label={basicInfoMapping.createdDate.label}
          tooltip={basicInfoMapping.createdDate.tooltip}
          value={
            blockRecord.overview.createdAt
              ? new Date(blockRecord.overview.createdAt).toLocaleString()
              : "N/A"
          }
        />

        <LabeledRow
          label={basicInfoMapping.authorIndex.label}
          tooltip={basicInfoMapping.authorIndex.tooltip}
          value={header.author_index}
        />

        <LabeledRow
          label={basicInfoMapping.workReport.label}
          tooltip={basicInfoMapping.workReport.tooltip}
          value={
            extrinsic.guarantees?.length ? (
              <MuiLink
                href={`/block/${blockRecord.headerHash}/work-report`}
                sx={{ color: "#1976d2", textDecoration: "underline" }}
              >
                {extrinsic.guarantees.length}
                {pluralize(" report", extrinsic.guarantees.length)} in this
                block
              </MuiLink>
            ) : (
              "0 report in this block"
            )
          }
        />

        <ExtrinsicAccordion
          extrinsic={extrinsic || null}
          headerHash={headerHash}
        />
      </Paper>
      <MoreDetailsAccordion header={header} />
    </>
  );
}
