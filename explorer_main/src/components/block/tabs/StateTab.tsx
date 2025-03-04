"use client";

import React from "react";
import { Paper, Typography, Divider } from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import { jamStateMapping } from "@/utils/tooltipDetails";

interface StateTabProps {
  stateRecord: any; // Use your actual StateRecord type here.
}

export function StateTab({ stateRecord }: StateTabProps) {
  const jamState = stateRecord?.state;

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      {jamState ? (
        <>
          {Object.entries(jamStateMapping).map(([key, { label, tooltip }]) => {
            const rawValue = jamState[key];
            const displayValue =
              typeof rawValue === "object"
                ? JSON.stringify(rawValue)
                : rawValue ?? "N/A";

            return (
              <React.Fragment key={key}>
                <LabeledRow
                  label={label}
                  tooltip={tooltip}
                  value={displayValue}
                  labelWidth={300}
                />
                <Divider sx={{ my: 3 }} />
              </React.Fragment>
            );
          })}
        </>
      ) : (
        <Typography variant="body2">No state data available.</Typography>
      )}
    </Paper>
  );
}
