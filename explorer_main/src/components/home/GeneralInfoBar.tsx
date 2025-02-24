"use client";

import React, { useState } from "react";
import { Paper, Grid, Typography } from "@mui/material";

export default function GeneralInfoBar() {
  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">ETH Price</Typography>
          <Typography variant="subtitle1">$2,800.00</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Gas Price</Typography>
          <Typography variant="subtitle1">80 Gwei</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Network Status</Typography>
          <Typography variant="subtitle1" color="green">
            Healthy
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
