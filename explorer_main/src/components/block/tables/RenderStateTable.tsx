import React from "react";
import TableFormat1 from "../tables/TableFormat1";
import TableFormat2 from "../tables/TableFormat2";
import XiTable from "../tables/XiTable";
import BetaTable from "../tables/BetaTable";
import ChiTable from "../tables/ChiTable";
import EtaTable from "../tables/EtaTable";
import GammaTable from "../tables/GammaTable";
import PiTable from "../tables/PiTable";
import PsiTable from "../tables/PsiTable";
import RhoTable from "../tables/RhoTable";
import ThetaTable from "../tables/ThetaTable";
import AccountTable from "../tables/AccountsTable";
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
import { Typography } from "@mui/material";

// Now renderTable takes headerHash as a parameter.
export const renderTable = (
  stateData: State,
  key: keyof State,
  headerHash: string
) => {
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
    const item = stateData[key] as GammaItem | undefined;
    if (item) {
      return <GammaTable data={[item]} />;
    }
  } else if (key === "pi") {
    const item = stateData[key] as PiItem | undefined;
    if (item) {
      return <PiTable data={item} />;
    }
  } else if (key === "psi") {
    const item = stateData[key] as PsiItem | undefined;
    if (item) {
      return <PsiTable data={item} />;
    }
  } else if (key === "rho") {
    const item = stateData[key] as RhoItem | undefined;
    if (item) {
      // Pass headerHash to RhoTable.
      return <RhoTable data={item} headerHash={headerHash} />;
    }
  } else if (key === "theta") {
    const item = stateData[key] as ThetaItem | undefined;
    if (!item || !Array.isArray(item) || item.flat(Infinity).length === 0) {
      return <Typography variant="body1">No Theta data available.</Typography>;
    }
    return <ThetaTable data={item} headerHash={headerHash} />;
  } else if (key === "xi") {
    const items = stateData[key] as string[][] | undefined;
    if (items && items.length > 0) {
      return <XiTable data={items} />;
    }
  } else if (key === "accounts") {
    const items = stateData[key] as AccountItem[] | null | undefined;
    if (items && items.length > 0) {
      console.log(items);
      return <AccountTable accounts={items} />;
    }
  }

  return null;
};
