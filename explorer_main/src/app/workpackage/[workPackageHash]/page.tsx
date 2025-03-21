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
export default function WorkPackageDetail() {
  const params = useParams();
  const workPackageHash = params.workPackageHash as string;
  console.log(workPackageHash);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>Work Package Detail</Typography>
    </Container>
  );
}
