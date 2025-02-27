import React, { useEffect, useCallback } from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";

interface Deco {
  vrf_output: string;
}

interface AssurancesItemProps {
  assurance: {
    attempt: number;
    signature: string;
  };
  idx: number;
  expanded: boolean;
}

export default function AssurancesItem({
  assurance,
  idx,
  expanded,
}: AssurancesItemProps) {
  const [decoded, setDecoded] = React.useState<Deco | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const decodeassuranceSignature = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jam.bayeseer.com/api/bandersnatch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectType: "GetassuranceVRF",
            inputText: JSON.stringify(assurance),
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      let result = data.result;
      // If the result is a string, try to parse it
      if (typeof result === "string") {
        try {
          result = JSON.parse(result);
        } catch (parseError) {
          console.error("Error parsing result string:", parseError);
        }
      }
      setDecoded(result);
      console.log("Decoded assurance result:", result);
    } catch (error) {
      console.error("Error decoding assurance:", error);
      setDecoded({ vrf_output: "Error decoding assurance" });
    }
    setLoading(false);
  }, [assurance]);

  // Decode automatically when expanded if not already decoded
  useEffect(() => {
    if (expanded && !decoded && !loading) {
      decodeassuranceSignature();
    }
  }, [expanded, decoded, loading, decodeassuranceSignature]);

  return (
    <Box sx={{ py: 1, borderTop: "1px solid #ccc" }}>
      <Typography variant="body2">assurance {idx}</Typography>
      <Typography variant="body2" color="textSecondary">
        Attempt: {assurance.attempt}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {loading ? (
          "Decoding VRF..."
        ) : decoded ? (
          `VRF: ${decoded.vrf_output}`
        ) : (
          <MuiLink
            component="button"
            onClick={decodeassuranceSignature}
            sx={{ textDecoration: "underline" }}
          >
            {`Signature: ${assurance.signature}`}
          </MuiLink>
        )}
      </Typography>
    </Box>
  );
}
