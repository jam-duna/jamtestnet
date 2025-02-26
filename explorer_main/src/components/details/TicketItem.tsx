"use client";

import React, { useEffect } from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";

interface DecodedTicket {
  vrf_output: string;
}

interface TicketItemProps {
  ticket: {
    attempt: number;
    signature: string;
  };
  idx: number;
  expanded: boolean;
}

export default function TicketItem({ ticket, idx, expanded }: TicketItemProps) {
  const [decoded, setDecoded] = React.useState<DecodedTicket | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  console.log(ticket);
  const decodeTicketSignature = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jam.bayeseer.com/api/bandersnatch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectType: "GetTicketVRF",
            inputText: JSON.stringify(ticket),
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
      console.log("Decoded ticket result:", result);
    } catch (error) {
      console.error("Error decoding ticket:", error);
      setDecoded({ vrf_output: "Error decoding ticket" });
    }
    setLoading(false);
  };

  // Decode automatically when expanded if not already decoded
  useEffect(() => {
    if (expanded && !decoded && !loading) {
      decodeTicketSignature();
    }
  }, [expanded]);

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2">Ticket {idx} </Typography>
      <Typography variant="body2" color="textSecondary">
        Attempt: {ticket.attempt}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {loading ? (
          "Decoding VRF..."
        ) : decoded ? (
          `VRF: ${decoded.vrf_output}`
        ) : (
          <MuiLink
            component="button"
            onClick={decodeTicketSignature}
            sx={{ textDecoration: "underline" }}
          >
            {`Signature: ${ticket.signature}`}
          </MuiLink>
        )}
      </Typography>
    </Box>
  );
}
