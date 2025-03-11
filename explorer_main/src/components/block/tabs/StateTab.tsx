"use client";

import React, { useState } from "react";
import { Paper, Typography, Divider, Button, Box } from "@mui/material";
import { LabeledRow } from "@/components/display/LabeledRow";
import { jamStateMapping } from "@/utils/tooltipDetails";
import { JsonEditor, githubLightTheme } from "json-edit-react";
import dynamic from "next/dynamic";
import { JsonRedirectButtonDefinition } from "../JsonRedirectButton";
import TableFormat1 from "../tables/TableFormat1";
import TableFormat2 from "../tables/TableFormat2";
import XiTable from "../tables/XiTable";
import {
  BetaItem,
  ChiItem,
  GammaItem,
  KeyedItem,
  PiItem,
  PsiItem,
  RhoItem,
  ThetaItem,
} from "@/types";
import { State } from "@/db/db";
import BetaTable from "../tables/BetaTable";
import ChiTable from "../tables/ChiTable";
import EtaTable from "../tables/EtaTable";
import GammaTable from "../tables/GammaTable";
import PiTable from "../tables/PiTable";
import PsiTable from "../tables/PsiTable";
import RhoTable from "../tables/RhoTable";
import ThetaTable from "../tables/ThetaTable";

interface StateTabProps {
  stateRecord: any; // Replace with your actual StateRecord type if available.
}

// Helper function to render table view for specific keys.
// It checks if the data is an array of objects (KeyedItem[])
// or an array of arrays (string[][]) and returns the corresponding table component.
export const renderTable = (stateData: State, key: keyof State) => {
  if (key === "alpha" || key === "varphi") {
    const items = stateData[key] as string[][] | undefined;
    if (items && items.length > 0) {
      return <TableFormat2 data={items} />;
    }
  } else if (key === "iota" || key === "kappa" || key === "lambda") {
    const items = stateData[key] as KeyedItem[] | undefined;
    if (items && items.length > 0) {
      return <TableFormat1 data={items} />;
    }
  } else if (key === "beta") {
    const items = stateData[key] as BetaItem[] | undefined;
    if (items && items.length > 0) {
      return <BetaTable data={items} />;
    }
  } else if (key === "chi") {
    // chi is a single object. Wrap it in an array.
    const item = stateData[key] as ChiItem | undefined;
    if (item) {
      return <ChiTable data={[item]} />;
    }
  } else if (key === "eta") {
    const item = stateData[key] as string[] | undefined;
    if (item) {
      return <EtaTable data={item} />;
    }
  } else if (key === "gamma") {
    // chi is a single object. Wrap it in an array.
    const item = stateData[key] as GammaItem | undefined;
    if (item) {
      return <GammaTable data={[item]} />;
    }
  } else if (key === "pi") {
    // chi is a single object. Wrap it in an array.
    const item = stateData[key] as PiItem | undefined;
    if (item) {
      return <PiTable data={item} />;
    }
  } else if (key === "psi") {
    // chi is a single object. Wrap it in an array.
    const item = stateData[key] as PsiItem | undefined;
    if (item) {
      return <PsiTable data={item} />;
    }
  } else if (key === "rho") {
    // chi is a single object. Wrap it in an array.
    const item = stateData[key] as RhoItem | undefined;
    if (item) {
      return <RhoTable data={item} />;
    }
  } else if (key === "theta") {
    const item = stateData[key] as ThetaItem | undefined;
    if (item) {
      return <ThetaTable data={item} />;
    }
  } else if (key === "xi") {
    const items = stateData[key] as string[][] | undefined;
    if (items && items.length > 0) {
      return <XiTable data={items} />;
    }
  }
  return null;
};

export function StateTab({ stateRecord }: StateTabProps) {
  const jamState = stateRecord;
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
                  // Use our helper to determine which table to render.
                  renderTable(jamState, key as keyof State) ?? (
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
