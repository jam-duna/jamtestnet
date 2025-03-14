import React from "react";
import { Box, Typography } from "@mui/material";
import { Disputes } from "@/types";

interface DisputeItemProps {
  disputes: Disputes;
  idx: number;
}

export default function DisputeItem({ disputes, idx }: DisputeItemProps) {
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
        Disputes {idx}
      </Typography>
      <Typography variant="body2">
        Verdicts: {disputes.verdicts?.length || 0}
      </Typography>
      <Typography variant="body2">
        Culprits: {disputes.culprits?.length || 0}
      </Typography>
      <Typography variant="body2">
        Faults: {disputes.faults?.length || 0}
      </Typography>
    </Box>
  );
}
