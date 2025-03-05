"use client";

import React, { useState } from "react";
import { Paper, Typography, Divider, Button, Box } from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import { jamStateMapping } from "@/utils/tooltipDetails";
import { JsonEditor, githubLightTheme } from "json-edit-react";
import JsonTable from "ts-react-json-table";
import { JsonRedirectButtonDefinition } from "../JsonRedirectButton";

interface StateTabProps {
  stateRecord: any; // Replace with your actual StateRecord type if available.
}

// Helper function to render table view for specific keys.
const renderTable = (stateData: any, key: string) => {
  let items;
  switch (key) {
    case "iota":
      items = stateData.iota;
      break;
    case "kappa":
      items = stateData.kappa;
      break;
    case "lambda":
      items = stateData.lambda;
      break;

    default:
      return null;
  }
  if (!items) return null;
  console.log(items);
  // Ensure items is an array
  return <JsonTable rows={Array.isArray(items) ? items : [items]} />;
};

export function StateTab({ stateRecord }: StateTabProps) {
  const jamState = stateRecord?.state;
  const [viewMode, setViewMode] = useState<"json" | "table">("json");

  const toggleView = () => {
    setViewMode((prev) => (prev === "json" ? "table" : "json"));
  };

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Button variant="contained" onClick={toggleView} sx={{ mb: 2 }}>
        Toggle View ({viewMode})
      </Button>
      {jamState ? (
        <>
          {Object.entries(jamStateMapping).map(([key, { label, tooltip }]) => {
            const rawValue = jamState[key];
            let displayValue;
            if (typeof rawValue === "object") {
              displayValue =
                viewMode === "json" ? (
                  <JsonEditor
                    data={rawValue}
                    viewOnly={true}
                    collapse={true}
                    theme={githubLightTheme}
                    customButtons={[JsonRedirectButtonDefinition]}
                  />
                ) : (
                  // Try to render table view for specific keys; if not available, show fallback.
                  renderTable(jamState, key) ?? (
                    <Typography variant="body2">
                      Table view not available for key "{key}"
                    </Typography>
                  )
                );
            } else {
              displayValue = rawValue ?? "N/A";
            }
            return (
              <React.Fragment key={key}>
                <LabeledRow
                  label={label}
                  tooltip={tooltip}
                  value={<Box component="div">{displayValue}</Box>}
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
