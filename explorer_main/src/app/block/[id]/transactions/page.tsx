"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

// Define a TypeScript interface for a transaction.
interface Transaction {
  id: number;
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

// Sample transactions for the block; in a real app, fetch these using the block ID.
const sampleBlockTransactions: Transaction[] = [
  {
    id: 1,
    hash: "0xtx123...",
    from: "0xabc...",
    to: "0xdef...",
    amount: "1.5 ETH",
    timestamp: "2025-02-19 10:05",
  },
  {
    id: 2,
    hash: "0xtx456...",
    from: "0xghi...",
    to: "0xjkl...",
    amount: "0.8 ETH",
    timestamp: "2025-02-19 10:03",
  },
  {
    id: 3,
    hash: "0xtx789...",
    from: "0xmno...",
    to: "0xpqr...",
    amount: "2.0 ETH",
    timestamp: "2025-02-19 10:00",
  },
];

export default function BlockTransactionsPage() {
  const params = useParams();
  const blockId = params.id;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Transactions for Block #{blockId}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
          Below is a list of all transactions included in this block.
        </Typography>
      </Paper>
      {sampleBlockTransactions.map((tx) => (
        <Card key={tx.id} sx={{ mb: 2 }}>
          <CardContent>
            {/* Clicking the transaction hash navigates to the Transaction Detail Page */}
            <Link
              href={`/transaction/${tx.hash}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="subtitle1" sx={{ cursor: "pointer" }}>
                Tx Hash: {tx.hash}
              </Typography>
            </Link>
            <Typography variant="body2" color="textSecondary">
              From: {tx.from}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              To: {tx.to}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Amount: {tx.amount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Time: {tx.timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Link href={`/block/${blockId}`} passHref>
        <Button variant="contained" sx={{ mt: 2 }}>
          Back to Block Overview
        </Button>
      </Link>
    </Container>
  );
}
