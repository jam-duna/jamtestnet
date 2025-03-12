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
  AccountItem,
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
import AccountTable from "../tables/AccountsTable";

interface StateTabProps {
  stateRecord: any; // Replace with your actual StateRecord type if available.
}

// Helper function to render table view for specific keys.
// It checks if the data is an array of objects (KeyedItem[])
// or an array of arrays (string[][]) and returns the corresponding table component.
export const renderTable = (stateData: State, key: keyof State) => {
  console.log(key);
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
    if (Array.isArray(item) && item.flat(Infinity).length !== 0) {
      return <ThetaTable data={item} />;
    }
  } else if (key === "xi") {
    const items = stateData[key] as string[][] | undefined;
    if (items && items.length > 0) {
      return <XiTable data={items} />;
    }
  } else if (key === "accounts") {
    const items = stateData[key] as AccountItem[] | null | undefined;
    if (items && items.length > 0) {
      return <AccountTable accounts={items} />;
    }
  }

  console.log(key);

  return null;
};

export function StateTab({ stateRecord }: StateTabProps) {
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
            blob: "0x0000000000000200002000bb030000040283464001e2017d02b00228ab00000028ae00000028e60251089b0064797c77510791005127ff0090006c7a570a09330a330828735527c0000d330a01330b80284a5527e0000e330a02330b40ff283c5527f0000e330a03330b20ff282e5527f8000e330a04330b10ff28205527fc000e330a05330b08ff2812887afe00330b04ff93ab02ff85aa0701ae8a2b3308c8b70764ab01c8b90c7ccc97880895bbffd4c808520bf28aa903cf9707c88707320032000000003308249577043200951130ff7b10c8007b15c0007b16b80064859555f8510523029577087d783306015a085d848aff0083a8ff8488ff003306025328bf004c84a8e0003306035128c0004084a8f0003306045128e0003484a8f8003306055128f0002884a8fc003306065128f8001c84a8fe003306075128fc001088a8fe00858601976603017b15ac65b90164756468501002d2fe510728821aaa6aa801c856077c78957b018567ffc87a0a5108183305330695a8c05208a20028180133053306281101510a7d7db73305015a075a8477ff008378ff848cff00330502532cbf0049847ce000330503512cc0003d847cf000330504512ce00031847cf800330505512cf00025847cfc00330506512cf80019847cfe00330507512cfc000d3305085327fe00207b1aac5a1b0164b7645864b650100430fe6458646b6476821a28073308330601c88b05c8650bc88607c97a0a95a8c051087d95b7407d7a3309015a0a6b84aaff0083a9ff849bff00330cbf00330902accb5384abe000330cc000330903aacb4584abf000330ce000330904aacb3784abf800330cf000330905aacb2984abfc00330cf800330906aacb1b84abfe00330cfc00330907aacb0d330bfe00330908acba0dac987c649850100695fdc856068068fc330964330a6464570a0964757b1708481114951714330804951908330a040a0395171833098000330850100848330820a107330964951a1864570a0b8217084921b0004921a8004921a0007b179800330820951798008210c8008215c0008216b8009511d00032000000000000330732008d7a84aa07c8a70b510a0e647c0178c895cc01acbcfbc9a903843cf8c8cb0a580c1d8482ff0014090101010101010101ca920c017bbc95bb08acabfb843907520905280ec8a9090178a895aa01ac9afb320021242a825285a49028240a8942a288c894a62449524f8a8828919248244442244442244442248b0a2952925422959444222112222112222112128a2a545593244949242289482292882422894822492149aa24494a1421a94444242222fa5592962449049025495912",
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

  console.log(jamState);
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
