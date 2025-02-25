"use client";

import React from "react";
import Link from "next/link";
import { Typography, Paper, Card, CardContent } from "@mui/material";
import { BlockRecord } from "../../../db";

type ExtrinsicListsProps = {
  latestBlocks: BlockRecord[];
  getRelativeTime: (timestamp: number) => string;
};

export default function ExtrinsicLists({
  latestBlocks,
  getRelativeTime,
}: ExtrinsicListsProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Extrinsic Lists
      </Typography>
      {latestBlocks.map((blockItem) => {
        const extrinsic = blockItem.block.extrinsic;
        let ticketsCount = 0;
        let disputesCount = 0;
        let guaranteesCount = 0;
        let preimagesCount = 0;
        let assurancesCount = 0;
        let totalEvents = 0;

        if (extrinsic) {
          ticketsCount = Array.isArray(extrinsic.tickets)
            ? extrinsic.tickets.length
            : 0;

          if (extrinsic.disputes) {
            const verdictsCount = Array.isArray(extrinsic.disputes.verdicts)
              ? extrinsic.disputes.verdicts.length
              : 0;
            const culpritsCount = Array.isArray(extrinsic.disputes.culprits)
              ? extrinsic.disputes.culprits.length
              : 0;
            const faultsCount = Array.isArray(extrinsic.disputes.faults)
              ? extrinsic.disputes.faults.length
              : 0;
            disputesCount = verdictsCount + culpritsCount + faultsCount;
          }

          guaranteesCount = Array.isArray(extrinsic.guarantees)
            ? extrinsic.guarantees.length
            : 0;
          preimagesCount = Array.isArray(extrinsic.preimages)
            ? extrinsic.preimages.length
            : 0;
          assurancesCount = Array.isArray(extrinsic.assurances)
            ? extrinsic.assurances.length
            : 0;

          totalEvents =
            ticketsCount +
            disputesCount +
            guaranteesCount +
            preimagesCount +
            assurancesCount;
        }

        return (
          <Link
            key={blockItem.headerHash}
            href={`/block/${blockItem.headerHash}/extrinsic`}
            style={{ textDecoration: "none" }}
          >
            <Card sx={{ mb: 2, cursor: "pointer" }}>
              <CardContent>
                <Typography variant="subtitle1">
                  Extrinsic Events: {totalEvents} (
                  {blockItem.overview.createdAt
                    ? getRelativeTime(blockItem.overview.createdAt)
                    : "N/A"}
                  )
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Header Hash: {blockItem.headerHash}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Details: Tickets: {ticketsCount}, Disputes: {disputesCount},
                  Guarantees: {guaranteesCount}, Preimages: {preimagesCount},
                  Assurances: {assurancesCount}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </Paper>
  );
}
