"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Link as MuiLink,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { db, BlockRecord } from "../../../../db";
import { LabeledRow } from "../../../components/details/LabeledRow"; // Adjust path as needed

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

  const raw = blockRecord.rawData;
  const header = raw.header;
  const extrinsic = raw.extrinsic;
  const guarantees = extrinsic.guarantees || [];
  const guaranteesCount = guarantees.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Block Overview
        </Typography>

        <LabeledRow
          label="Block Height:"
          tooltip="The slot or number representing the height of this block."
          value={blockRecord.slot}
        />

        <LabeledRow
          label="Block Hash:"
          tooltip="A unique cryptographic identifier for this block."
          value={blockRecord.blockHash}
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
            guaranteesCount > 0 ? (
              <MuiLink
                href={`/block/${blockRecord.headerHash}/work-report`}
                sx={{ color: "#1976d2", textDecoration: "underline" }}
              >
                {guaranteesCount} reports in this block
              </MuiLink>
            ) : (
              "0 reports in this block"
            )
          }
        />

        {/* More Details Accordion */}
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">More Details</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <LabeledRow
                label="Parent:"
                tooltip="Hash of the previous block in the chain."
                value={header.parent}
              />
              <LabeledRow
                label="Parent State Root:"
                tooltip="Merkle root summarizing the entire state after the parent block."
                value={header.parent_state_root}
              />
              <LabeledRow
                label="Seal:"
                tooltip="A cryptographic seal containing the block producer's signature and possibly VRF data."
                value={header.seal}
              />
              <LabeledRow
                label="Entropy Source:"
                tooltip="Used to provide randomness for the protocol. Typically not crucial for end-users."
                value={header.entropy_source}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Extrinsic Details Title */}
        <Typography variant="h5" sx={{ mt: 8, mb: 3 }}>
          Extrinsic Details
        </Typography>

        {/* Tickets Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Tickets can represent rights or claims associated with scheduling, rewards, or other operations.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography>
                Tickets ({extrinsic.tickets ? extrinsic.tickets.length : 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {extrinsic.tickets && extrinsic.tickets.length > 0 ? (
                extrinsic.tickets.map((ticket: any, idx: number) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      m: 0,
                    }}
                  >
                    Ticket {idx + 1}: {JSON.stringify(ticket)}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word", m: 0 }}
                >
                  No tickets
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Disputes Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Disputes capture any challenges or faults raised regarding the block's execution.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography>
                Disputes (
                {extrinsic.disputes
                  ? (extrinsic.disputes.verdicts?.length || 0) +
                    (extrinsic.disputes.culprits?.length || 0) +
                    (extrinsic.disputes.faults?.length || 0)
                  : 0}
                )
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {extrinsic.disputes ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "normal", wordBreak: "break-word", m: 0 }}
                  >
                    Verdicts: {extrinsic.disputes.verdicts?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "normal", wordBreak: "break-word", m: 0 }}
                  >
                    Culprits: {extrinsic.disputes.culprits?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "normal", wordBreak: "break-word", m: 0 }}
                  >
                    Faults: {extrinsic.disputes.faults?.length || 0}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word", m: 0 }}
                >
                  No disputes
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Assurances Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Assurances are confirmations or endorsements from validators.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography>
                Assurances (
                {extrinsic.assurances ? extrinsic.assurances.length : 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {extrinsic.assurances && extrinsic.assurances.length > 0 ? (
                extrinsic.assurances.map((assurance: any, idx: number) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      m: 0,
                    }}
                  >
                    Assurance {idx + 1}: {JSON.stringify(assurance)}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    m: 0,
                  }}
                >
                  No assurances
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Guarantees Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Guarantees provide additional security or bonds for the operation, typically including a report and validator signatures.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography>Guarantees ({guaranteesCount})</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {guaranteesCount > 0 ? (
                guarantees.map((guarantee: any, idx: number) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      m: 0,
                    }}
                  >
                    Guarantee {idx + 1}:{" "}
                    {JSON.stringify(guarantee.report.package_spec)}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    m: 0,
                  }}
                >
                  No guarantees
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Preimages Accordion */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Preimages are the original data that was hashed and stored on-chain for later revelation.">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography>
                Preimages (
                {extrinsic.preimages ? extrinsic.preimages.length : 0})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {extrinsic.preimages && extrinsic.preimages.length > 0 ? (
                extrinsic.preimages.map((preimage: any, idx: number) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      m: 0,
                    }}
                  >
                    Preimage {idx + 1}: {JSON.stringify(preimage)}
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    m: 0,
                  }}
                >
                  No preimages
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
}
