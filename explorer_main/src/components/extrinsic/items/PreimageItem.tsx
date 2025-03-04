import React from "react";
import { Box, Typography } from "@mui/material";
import { Preimage } from "@/types";

interface PreimageItemProps {
  preimage: Preimage;
  idx: number;
  expanded: boolean;
}

export default function PreimageItem({ preimage, idx }: PreimageItemProps) {
  return (
    <Box
      sx={{
        py: 1,
        borderTop: "1px solid #ccc",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        Preimage {idx}
      </Typography>
      {Object.entries(preimage).map(([key, value]) => (
        <Typography
          key={key}
          variant="body2"
          color="textSecondary"
          gutterBottom
        >
          {key}: {value}
        </Typography>
      ))}
    </Box>
  );
}
