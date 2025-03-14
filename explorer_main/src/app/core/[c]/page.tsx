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
import { LabeledRow } from "@/components/display/LabeledRow"; // adjust the import path as needed
import { db, Block, State } from "@/db/db";
import { Guarantee } from "@/types";
import { workReportMapping } from "@/utils/tooltipDetails"; // Import the new mapping bundle
import { useWorkReportStatuses } from "@/hooks/workReport/useWorkReportStatuses";

export default function CoreDetailPage() {
  const params = useParams();
  const serviceId = params.serviceId as string;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>Service</Typography>
      <></>
    </Container>
  );
}
