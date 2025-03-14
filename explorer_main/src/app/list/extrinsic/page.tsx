"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import ExtrinsicListItem from "@/components/home/lists/list-item/ExtrinsicListItem";
import { db, Block } from "@/db/db";
import { filterExtrinsicBlocks } from "@/utils/extrinsics";
import { pluralize } from "@/utils/helper";

export default function AllExtrinsicListPage() {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [now, setNow] = useState(Date.now());
  const filteredBlocks = filterExtrinsicBlocks(latestBlocks);

  useEffect(() => {
    db.blocks
      .toArray()
      .then((blocks) => {
        const sorted = blocks.sort((a, b) => {
          const aCreatedAt = a?.overview?.createdAt;
          const bCreatedAt = b?.overview?.createdAt;

          // If both items have no createdAt, consider them equal.
          if (aCreatedAt == null && bCreatedAt == null) {
            return 0;
          }
          // If a is missing createdAt, put it after b.
          if (aCreatedAt == null) {
            return 1;
          }
          // If b is missing createdAt, put it after a.
          if (bCreatedAt == null) {
            return -1;
          }
          // Otherwise, sort in descending order (newest first)
          return bCreatedAt - aCreatedAt;
        });
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
          All Extrinsics List
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          There are {filteredBlocks.length}{" "}
          {pluralize(" report", filteredBlocks.length)} found in the page
        </Typography>
      </Box>
      <Paper variant="outlined">
        {filteredBlocks.map((blockItem) => (
          <ExtrinsicListItem
            key={blockItem?.overview?.headerHash}
            blockItem={blockItem}
          />
        ))}
      </Paper>
    </Container>
  );
}
