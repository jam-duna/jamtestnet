"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Link as MuiLink,
  Box,
  Divider,
} from "@mui/material";
import { db, BlockRecord, StateRecord } from "../../../../db";
import { LabeledRow } from "@/components/details/LabeledRow";
import ExtrinsicAccordion from "@/components/details/ExtrinsicAccordion";
import MoreDetailsAccordion from "@/components/details/MoreDetailsAccordion";
import BlockNavigationButtons from "@/components/details/BlockNavigationButtons";
import DetailToggleButtons from "@/components/details/DetailToggleButtons";

// Mapping for labels and tooltips
const detailsMapping = {
  blockHeight: {
    label: "Block Height:",
    tooltip: "The slot or number representing the height of this block.",
  },
  blockHash: {
    label: "Block Hash:",
    tooltip: "A unique cryptographic identifier for this block.",
  },
  headerHash: {
    label: "Header Hash:",
    tooltip: "The unique hash of the block header.",
  },
  authorIndex: {
    label: "Author Index:",
    tooltip:
      "The validator index (or block producer ID) who created this block.",
  },
  workReport: {
    label: "Work Report:",
    tooltip:
      "Indicates how many 'guarantees' are in the extrinsic. They often represent work packages or tasks.",
  },
};

const jamStateMapping: Record<string, { label: string; tooltip: string }> = {
  alpha: {
    label: "Authorizations Pool",
    tooltip:
      "A list of authorization hashes for each core (c0 to c15) that determines which operations are allowed.",
  },
  beta: {
    label: "Recent Blocks",
    tooltip:
      "A record of the most recent blocks processed by the network, used to verify chain continuity.",
  },
  chi: {
    label: "Privileged Service Indices",
    tooltip:
      "Indices identifying services with special permissions in the network.",
  },
  eta: {
    label: "ETA Data",
    tooltip:
      "Estimated time or additional timing details (subject to further clarification).",
  },
  gamma: {
    label: "Safrole State Gamma",
    tooltip: "Core state data related to the Safrole consensus component.",
  },
  iota: {
    label: "Iota Data",
    tooltip:
      "Additional state information labeled as Iota; details may be refined in future documentation.",
  },
  kappa: {
    label: "Kappa Data",
    tooltip:
      "Additional state information labeled as Kappa; details are subject to further clarification.",
  },
  lambda: {
    label: "Lambda Data",
    tooltip:
      "Additional state information labeled as Lambda; further documentation is forthcoming.",
  },
  pi: {
    label: "Validator Statistics",
    tooltip: "Performance and operational data for network validators.",
  },
  psi: {
    label: "Disputes State",
    tooltip:
      "Information regarding network disputes and potential misbehavior incidents.",
  },
  rho: {
    label: "Availability Assignments",
    tooltip:
      "Data describing how tasks or data assignments are distributed across nodes.",
  },
  tau: {
    label: "Current Epoch",
    tooltip:
      "The current epoch or time period used for state transitions and reward calculations.",
  },
  theta: {
    label: "Accumulation Queue",
    tooltip:
      "A queue of pending accumulation operations that are waiting to be processed.",
  },
  varphi: {
    label: "Varphi Data",
    tooltip:
      "Additional state details labeled as Varphi; more details will be provided in future updates.",
  },
  xi: {
    label: "Accumulation History",
    tooltip:
      "Historical data of past accumulation operations, useful for auditing and reward distribution.",
  },
};

export default function BlockOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const headerHash = params.headerHash as string;

  const [blockRecord, setBlockRecord] = useState<BlockRecord | null>(null);
  const [stateRecord, setStateRecord] = useState<StateRecord | null>(null);

  // For next/prev block navigation:
  const [prevHash, setPrevHash] = useState<string | null>(null);
  const [nextHash, setNextHash] = useState<string | null>(null);

  // Local tab state to toggle between block and state info.
  const [selectedTab, setSelectedTab] = useState<"block" | "state">("block");

  // Load block and state records from Dexie.
  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record) => {
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });

      db.states
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record) => {
          setStateRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading state record:", error);
        });
    }
  }, [headerHash]);

  // Load previous and next block hashes once we have the current block record.
  useEffect(() => {
    if (blockRecord) {
      const currentSlot = blockRecord.block.header.slot;
      db.blocks
        .where("block.header.slot")
        .equals(currentSlot - 1)
        .first()
        .then((prevBlock) => {
          setPrevHash(prevBlock?.headerHash || null);
        });
      db.blocks
        .where("block.header.slot")
        .equals(currentSlot + 1)
        .first()
        .then((nextBlock) => {
          setNextHash(nextBlock?.headerHash || null);
        });
    }
  }, [blockRecord]);

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

  const block = blockRecord.block;
  const header = block.header;
  const extrinsic = block.extrinsic;
  const jamState = stateRecord?.state;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ display: "inline-flex", alignItems: "center", mb: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Block
        </Typography>
        <Typography variant="body1" sx={{ ml: 1.5 }}>
          # {header.slot}
        </Typography>
      </Box>

      {/* Toggle buttons for Block Info vs State Info */}
      <DetailToggleButtons
        selectedTab={selectedTab}
        onTabChange={(tab) => setSelectedTab(tab)}
      />

      {selectedTab === "block" ? (
        <>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <LabeledRow
              label={detailsMapping.blockHeight.label}
              tooltip={detailsMapping.blockHeight.tooltip}
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
              label={detailsMapping.blockHash.label}
              tooltip={detailsMapping.blockHash.tooltip}
              value={blockRecord.overview.blockHash}
            />

            <LabeledRow
              label={detailsMapping.headerHash.label}
              tooltip={detailsMapping.headerHash.tooltip}
              value={blockRecord.headerHash}
            />

            <LabeledRow
              label={detailsMapping.authorIndex.label}
              tooltip={detailsMapping.authorIndex.tooltip}
              value={header.author_index}
            />

            <LabeledRow
              label={detailsMapping.workReport.label}
              tooltip={detailsMapping.workReport.tooltip}
              value={
                extrinsic.guarantees?.length ? (
                  <MuiLink
                    href={`/block/${blockRecord.headerHash}/work-report`}
                    sx={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    {extrinsic.guarantees.length} report
                    {extrinsic.guarantees.length !== 1 ? "s" : ""} in this block
                  </MuiLink>
                ) : (
                  "0 report in this block"
                )
              }
            />

            <ExtrinsicAccordion
              tickets={extrinsic.tickets || []}
              disputes={extrinsic.disputes || null}
              assurances={extrinsic.assurances || []}
              guarantees={extrinsic.guarantees || []}
              preimages={extrinsic.preimages || []}
            />
          </Paper>
          <MoreDetailsAccordion header={header} />
        </>
      ) : (
        <Paper variant="outlined" sx={{ p: 3 }}>
          {/* If we have a jamState, display each mapped field as a LabeledRow */}
          {jamState ? (
            <>
              {Object.entries(jamStateMapping).map(
                ([key, { label, tooltip }]) => {
                  // The raw value from the jamState
                  const rawValue = jamState[key];
                  // We'll JSON-stringify objects/arrays, or display the raw if it's a primitive
                  const displayValue =
                    typeof rawValue === "object"
                      ? JSON.stringify(rawValue)
                      : rawValue ?? "N/A";

                  return (
                    <>
                      <LabeledRow
                        key={key}
                        label={label}
                        tooltip={tooltip}
                        value={displayValue}
                        labelWidth={300}
                      />
                      <Divider sx={{ my: 3 }} />
                    </>
                  );
                }
              )}
            </>
          ) : (
            <Typography variant="body2">No state data available.</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
}
