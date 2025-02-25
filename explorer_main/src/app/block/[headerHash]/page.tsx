"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Link as MuiLink,
  Box,
} from "@mui/material";
import { db, BlockRecord } from "../../../../db";
import { LabeledRow } from "../../../components/details/LabeledRow"; // For non-extrinsic rows
import ExtrinsicAccordion from "../../../components/details/ExtrinsicAccordion";
import MoreDetailsAccordion from "../../../components/details/MoreDetailsAccordion";

export default function BlockOverviewPage() {
  const params = useParams();
  const headerHash = params.headerHash as string;

  const [blockRecord, setBlockRecord] = useState<BlockRecord | null>(null);

  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record) => {
          console.log("Block record loaded from DB:", record);
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  if (!blockRecord) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">Block Details</Typography>
          <Typography variant="body1">Loading block details...</Typography>
        </Paper>
      </Container>
    );
  }

  // Use blockRecord.block based on the new DB scheme.
  const block = blockRecord.block;
  const header = block.header;
  const extrinsic = block.extrinsic;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Block Overview
        </Typography>

        <LabeledRow
          label="Block Height:"
          tooltip="The slot or number representing the height of this block."
          value={header.slot}
        />

        <LabeledRow
          label="Block Hash:"
          tooltip="A unique cryptographic identifier for this block."
          value={blockRecord.overview.blockHash}
        />

        <LabeledRow
          label="Header Hash:"
          tooltip="The unique hash of the block header."
          value={blockRecord.headerHash}
        />

        <LabeledRow
          label="Author Index:"
          tooltip="The validator index (or block producer ID) who created this block."
          value={header.author_index}
        />

        {/* Work Report Link */}
        <LabeledRow
          label="Work Report:"
          tooltip="Indicates how many 'guarantees' are in the extrinsic. They often represent work packages or tasks."
          value={
            blockRecord.block.extrinsic.guarantees &&
            blockRecord.block.extrinsic.guarantees.length > 0 ? (
              <MuiLink
                href={`/block/${blockRecord.headerHash}/work-report`}
                sx={{ color: "#1976d2", textDecoration: "underline" }}
              >
                {blockRecord.block.extrinsic.guarantees.length} reports in this
                block
              </MuiLink>
            ) : (
              "0 reports in this block"
            )
          }
        />

        {/* Extrinsic Accordion Component */}
        <ExtrinsicAccordion
          tickets={extrinsic.tickets || []}
          disputes={extrinsic.disputes || null}
          assurances={extrinsic.assurances || []}
          guarantees={extrinsic.guarantees || []}
          preimages={extrinsic.preimages || []}
        />

        <MoreDetailsAccordion header={header} />
      </Paper>
    </Container>
  );
}
