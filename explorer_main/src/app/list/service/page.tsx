"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Link as MuiLink,
} from "@mui/material";
export default function AllServicesDetails() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  console.log(serviceId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>Service</Typography>
      <Typography>Detail</Typography>
    </Container>
  );
}
