import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { Report } from "@/types/index";

interface GuaranteeSignature {
  signature: string;
  validator_index: number;
}

interface Guarantee {
  report: Report;
  slot: number;
  signatures: GuaranteeSignature[];
}

interface GuaranteeItemProps {
  guarantee: Guarantee;
  idx: number;
  expanded: boolean;
  headerHash: string;
}

export default function GuaranteeItem({
  guarantee,
  idx,
  headerHash,
}: GuaranteeItemProps) {
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
        Guarantees {idx}
      </Typography>
      <Box sx={{ ml: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Work Report:{" "}
          <Link
            href={`/block/${headerHash}/work-report/${guarantee.report.package_spec.hash}`}
            sx={{ textDecoration: "underline" }}
          >
            {guarantee.report.package_spec.hash}
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Slot: {guarantee.slot}
        </Typography>

        {/* Map over signatures */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          Signatures
        </Typography>
        {guarantee.signatures.map((sig, i) => (
          <Typography
            key={`signature-${i}`}
            variant="body2"
            color="textSecondary"
            sx={{ ml: 2 }}
            gutterBottom
          >
            Validator {sig.validator_index}: {sig.signature}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
