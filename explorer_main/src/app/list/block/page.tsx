"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import BlockListItem from "@/components/home/lists/list-item/BlockListItem";
import { db, BlockRecord } from "@/db/db"; // Updated DB scheme
import { pluralize } from "@/utils/helper";

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
      <Box sx={{ display: "flex-col", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          All Blocks List
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          There are {latestBlocks.length}{" "}
          {pluralize(" block", latestBlocks.length)} found in the page
        </Typography>
      </Box>
      <Paper variant="outlined">
        {latestBlocks.map((blockItem) => (
          <BlockListItem key={blockItem.headerHash} blockItem={blockItem} />
        ))}
      </Paper>
    </Container>
  );
}
