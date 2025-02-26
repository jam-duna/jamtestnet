/*
"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Define a TypeScript interface for transaction details.
interface TransactionDetail {
  hash: string;
  status: string;
  block: number;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: number;
  timestamp: string;
}

// Sample transaction detail; in a real app, you would fetch details based on the tx hash.
const sampleTransactionDetail: TransactionDetail = {
  hash: "0xtx123...",
  status: "Success",
  block: 16724371,
  from: "0xabc...",
  to: "0xdef...",
  value: "1.5 ETH",
  gasPrice: "80 Gwei",
  gasUsed: 21000,
  timestamp: "2025-02-19 10:05",
};

export default function TransactionDetailPage() {
  const params = useParams();
  const txHash = params.hash; // Extract the tx hash from the URL.

  // For now, we'll use sample data. In a real application, fetch data based on txHash.
  const tx = sampleTransactionDetail;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Transaction Details
        </Typography>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tx Hash:{" "}
              <span style={{ fontFamily: "monospace" }}>{tx.hash}</span>
              <IconButton size="small" sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Status:</strong> {tx.status}
            </Typography>
            <Typography variant="body1">
              <strong>Block:</strong>{" "}
              <Link
                href={`/block/${tx.block}`}
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                {tx.block}
              </Link>
            </Typography>
            <Typography variant="body1">
              <strong>Timestamp:</strong> {tx.timestamp}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>From:</strong> {tx.from}
            </Typography>
            <Typography variant="body1">
              <strong>To:</strong> {tx.to}
            </Typography>
            <Typography variant="body1">
              <strong>Value:</strong> {tx.value}
            </Typography>
            <Typography variant="body1">
              <strong>Gas Price:</strong> {tx.gasPrice}
            </Typography>
            <Typography variant="body1">
              <strong>Gas Used:</strong> {tx.gasUsed}
            </Typography>
          </Grid>
        </Grid>
        <Link href={`/block/${tx.block}/transactions`} passHref>
          <Button variant="contained" sx={{ mt: 3 }}>
            Back to Transactions
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}

*/
