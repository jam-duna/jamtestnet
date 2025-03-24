"use client";

import React from "react";
import { Paper, Typography, Box, Link as MuiLink } from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import ExtrinsicAccordion from "@/components/extrinsic/ExtrinsicAccordion";
import MoreDetailsAccordion from "@/components/block/MoreDetailsAccordion";
import BlockNavigationButtons from "@/components/block/BlockNavigationButtons";
import { basicInfoMapping } from "@/utils/tooltipDetails";
import { useRouter } from "next/navigation";
import { pluralize } from "@/utils/helper";
import { Block } from "@/db/db";

interface BlockTabProps {
  blockRecord: Block; // Use your actual BlockRecord type here.
  hash: string;
  type: string;
  prevHash: string | null;
  nextHash: string | null;
}

export function BlockTab({
  blockRecord,
  hash,
  type,
  prevHash,
  nextHash,
}: BlockTabProps) {
  const router = useRouter();
  const header = blockRecord.header;
  const extrinsic = blockRecord.extrinsic;
  const headerHash = blockRecord?.overview?.headerHash;
  const blockHash = blockRecord?.overview?.blockHash;
  const createdAt = blockRecord?.overview?.createdAt;

  return (
    <>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <LabeledRow
            label={basicInfoMapping.blockHeight.label}
            tooltip={basicInfoMapping.blockHeight.tooltip}
            value={
              <Typography variant="body1">{blockRecord.header.slot}</Typography>
            }
          />
          {type === "headerHash" && (
            <BlockNavigationButtons
              prevHash={prevHash}
              nextHash={nextHash}
              onPrev={() => {
                if (prevHash) router.push(`/block/${prevHash}?type=headerHash`);
              }}
              onNext={() => {
                if (nextHash) router.push(`/block/${nextHash}?type=headerHash`);
              }}
            />
          )}
        </Box>

        {blockHash && (
          <LabeledRow
            label={basicInfoMapping.blockHash.label}
            tooltip={basicInfoMapping.blockHash.tooltip}
            value={<Typography variant="body1">{blockHash}</Typography>}
          />
        )}

        {headerHash && (
          <LabeledRow
            label={basicInfoMapping.headerHash.label}
            tooltip={basicInfoMapping.headerHash.tooltip}
            value={<Typography variant="body1">{headerHash}</Typography>}
          />
        )}

        {createdAt && (
          <LabeledRow
            label={basicInfoMapping.createdDate.label}
            tooltip={basicInfoMapping.createdDate.tooltip}
            value={
              <Typography variant="body1">
                {blockRecord?.overview?.createdAt
                  ? new Date(createdAt).toLocaleString()
                  : "N/A"}
              </Typography>
            }
          />
        )}

        <LabeledRow
          label={basicInfoMapping.authorIndex.label}
          tooltip={basicInfoMapping.authorIndex.tooltip}
          value={<Typography variant="body1">{header.author_index}</Typography>}
        />

        <LabeledRow
          label={basicInfoMapping.workReport.label}
          tooltip={basicInfoMapping.workReport.tooltip}
          value={
            <Typography variant="body1">
              {extrinsic.guarantees?.length ? (
                <MuiLink
                  href={`/block/${headerHash}/workReport`}
                  sx={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  {extrinsic.guarantees.length}
                  {pluralize(" report", extrinsic.guarantees.length)} in this
                  block
                </MuiLink>
              ) : (
                "0 report in this block"
              )}
            </Typography>
          }
        />

        <ExtrinsicAccordion
          extrinsic={extrinsic || null}
          headerHash={hash}
          // type={type}
        />
      </Paper>
      <MoreDetailsAccordion header={header} />
    </>
  );
}
