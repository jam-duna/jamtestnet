"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Paper, Typography, Link } from "@mui/material";
import { db, BlockRecord } from "../../../../../db";
import { LabeledRow } from "@/components/details/LabeledRow"; // For non-extrinsic rows
import ExtrinsicAccordion from "@/components/details/ExtrinsicAccordion";

export default function ExtrinsicDetails() {
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
          <Typography variant="h4">Extrinsics Details</Typography>
          <Typography variant="body1">Loading extrinsics details...</Typography>
        </Paper>
      </Container>
    );
  }

  // Use blockRecord.block based on the new DB scheme.
  const block = blockRecord.block;
  const extrinsic = block.extrinsic;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold" }}
          gutterBottom
        >
          Extrinsics Details
        </Typography>

        <LabeledRow
          label="Header Hash:"
          tooltip="The unique hash of the block header."
          value={
            <Link href={`/block/${blockRecord.headerHash}`}>
              {blockRecord.headerHash}
            </Link>
          }
        />

        {/* Extrinsic Accordion Component */}
        <ExtrinsicAccordion
          tickets={extrinsic.tickets || []}
          disputes={extrinsic.disputes || null}
          assurances={extrinsic.assurances || []}
          guarantees={extrinsic.guarantees || []}
          preimages={extrinsic.preimages || []}
          initialExtrinsicExpanded={true}
        />
      </Paper>
    </Container>
  );
}
