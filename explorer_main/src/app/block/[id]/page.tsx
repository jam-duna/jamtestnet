"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Container, Paper, Card, CardContent, Typography } from "@mui/material";

// Sample block details; in a real app you would fetch these by block ID.
const sampleBlockDetails = {
  hash: "0xabc123...",
  timestamp: "2025-02-19 10:00",
  transactions: 25,
  miner: "0xMinerAddress...",
  size: "1,234 bytes",
  gasUsed: 21000,
  gasLimit: 30000,
};

export default function BlockOverviewPage() {
  const params = useParams();
  const blockId = params.id; // blockId from URL

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Block #{blockId} Overview
        </Typography>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">
              Block Hash: {sampleBlockDetails.hash}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Timestamp: {sampleBlockDetails.timestamp}
            </Typography>
            {/* Wrap transaction count with a Link to the transactions page */}
            <Typography variant="body2" color="textSecondary">
              Transactions:{" "}
              <Link
                href={`/block/${blockId}/transactions`}
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {sampleBlockDetails.transactions}
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Miner: {sampleBlockDetails.miner}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Size: {sampleBlockDetails.size}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Gas Used: {sampleBlockDetails.gasUsed} / Gas Limit:{" "}
              {sampleBlockDetails.gasLimit}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}
