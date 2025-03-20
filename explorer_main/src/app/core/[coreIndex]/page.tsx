"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, Link as MuiLink } from "@mui/material";

export default function CoreDetailPage() {
  const params = useParams();
  const coreIndex = params.coreIndex as string;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>Core {coreIndex}</Typography>
    </Container>
  );
}
