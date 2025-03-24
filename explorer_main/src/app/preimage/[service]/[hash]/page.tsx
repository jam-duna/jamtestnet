"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Container, Typography } from "@mui/material";
export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  console.log(serviceId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>Service ID {serviceId}</Typography>
      <Typography>Detail</Typography>
    </Container>
  );
}
