"use client";

import React, { useState } from "react";
import { Paper, Typography, Divider, Button, Box } from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import { jamStateMapping } from "@/utils/tooltipDetails";
import { JsonEditor, githubLightTheme } from "json-edit-react";
import { createJsonRedirectButtonDefinition } from "@/components/block/createJsonRedirectButtonDefinition";
import { State } from "@/db/db";
import { useParams } from "next/navigation";
import { renderTable } from "../tables/RenderStateTable"; // Adjust the import path as needed

interface StateTabProps {
  stateRecord: any; // Replace with your actual type if available.
}

export function StateTab({ stateRecord }: StateTabProps) {
  const { headerHash } = useParams() as { headerHash: string };

  // Example test data.
  const testData = [
    {
      id: 0,
      data: {
        service: {
          code_hash:
            "0xbd87fb6de829abf2bb25a15b82618432c94e82848d9dd204f5d775d4b880ae0d",
          balance: 10000000000,
          min_item_gas: 100,
          min_memo_gas: 100,
          bytes: 1157,
          items: 4,
        },
        preimages: [
          {
            hash: "0x8c30f2c101674af1da31769e96ce72e81a4a44c89526d7d3ff0a1a511d5f3c9f",
            blob: "0x00000000000000000020000a00000000000628023307320015",
          },
          {
            hash: "0xbd87fb6de829abf2bb25a15b82618432c94e82848d9dd204f5d775d4b880ae0d",
            blob: "0x0000000000000200002000bb030000040283464001e2017d02b00228ab...",
          },
        ],
        lookup_meta: [
          {
            key: {
              hash: "0x8c30f2c101674af1da31769e96ce72e81a4a44c89526d7d3ff0a1a511d5f3c9f",
              length: 25,
            },
            value: [0],
          },
          {
            key: {
              hash: "0xbd87fb6de829abf2bb25a15b82618432c94e82848d9dd204f5d775d4b880ae0d",
              length: 970,
            },
            value: [0],
          },
        ],
        storage: null,
      },
    },
  ];

  const jamState = { ...stateRecord, accounts: testData };
  const [viewMode, setViewMode] = useState<"json" | "table">("json");

  const toggleView = () =>
    setViewMode((prev) => (prev === "json" ? "table" : "json"));

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Button variant="contained" onClick={toggleView} sx={{ mb: 2 }}>
        Toggle View ({viewMode})
      </Button>
      {jamState ? (
        <>
          {Object.entries(jamStateMapping).map(([key, { label, tooltip }]) => {
            const rawValue = jamState[key];
            let displayValue: React.ReactNode;

            if (typeof rawValue === "object") {
              displayValue =
                viewMode === "json" ? (
                  <JsonEditor
                    data={rawValue}
                    viewOnly={true}
                    collapse={true}
                    theme={githubLightTheme}
                    customButtons={[
                      createJsonRedirectButtonDefinition(headerHash),
                    ]}
                  />
                ) : (
                  renderTable(jamState, key as keyof State, headerHash) ?? (
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
