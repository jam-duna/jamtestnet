"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import ExtrinsicListItem from "@/components/home/list-item/ExtrinsicListItem";
import { db, BlockRecord } from "../../../db"; // Updated DB scheme
import { getRelativeTime } from "@/utils/utils";
import { filterExtrinsicBlocks } from "@/utils/extrinsics";

export default function AllExtrinsicListPage() {
  const [latestBlocks, setLatestBlocks] = useState<BlockRecord[]>([]);
  const [now, setNow] = useState(Date.now());
  const filteredBlocks = filterExtrinsicBlocks(latestBlocks);

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
      {filteredBlocks.map((blockItem) => (
        <ExtrinsicListItem key={blockItem.headerHash} blockItem={blockItem} />
      ))}
    </Container>
  );
}
