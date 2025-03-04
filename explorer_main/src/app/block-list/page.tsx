"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import BlockListItem from "@/components/home/list-item/BlockListItem";
import { db, BlockRecord } from "../../../db"; // Updated DB scheme

export default function AllBlockListPage() {
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort(
          (a, b) => b.overview.createdAt - a.overview.createdAt
        );
        setLatestBlocks(sorted);
        setNow(Date.now());
      })
      .catch((error) => {
        console.error("Error loading blocks from DB:", error);
      });
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      {latestBlocks.map((blockItem) => (
        <BlockListItem key={blockItem.headerHash} blockItem={blockItem} />
      ))}
    </Container>
  );
}
