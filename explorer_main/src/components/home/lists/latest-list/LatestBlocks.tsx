import React from "react";
import { Paper, Typography } from "@mui/material";
import BlockListItem from "@/components/home/lists/list-item/BlockListItem";
import { Block } from "@/db/db";
import Link from "next/link";

type LatestBlocksProps = {
  latestBlocks: Block[];
};

export default function LatestBlocks({ latestBlocks }: LatestBlocksProps) {
  return (
    <Paper variant="outlined">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ px: 1.5, py: 2, borderBottom: "1px solid #ccc", m: 0 }}
      >
        Latest Blocks
      </Typography>

      {latestBlocks.map((blockItem) => (
        <BlockListItem
          key={blockItem?.overview?.headerHash || blockItem.header.slot}
          blockItem={blockItem}
        />
      ))}

      <Link
        href={`/list/block`}
        style={{
          textDecoration: "none",
          color: "inherit",
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ p: 2, "&:hover": { backgroundColor: "#f9f9f9" } }}
        >
          View All Blocks
        </Typography>
      </Link>
    </Paper>
  );
}
