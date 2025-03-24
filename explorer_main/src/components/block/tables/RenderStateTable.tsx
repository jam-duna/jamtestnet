/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Define an interface for table configuration
interface TableConfig<T> {
  // A type guard that checks if the data is valid and narrows it to type T
  predicate: (data: unknown) => data is T;
  // A render function that takes data of type T and returns the corresponding table
  render: (data: T) => React.ReactElement;
}

// A helper function that creates a mapping of state keys to table configurations.
// If needed, headerHash is captured for components that require it.
const getTableConfigs = (
  headerHash: string
): Partial<Record<keyof State, TableConfig<any>>> => ({
  alpha: {
    predicate: (data): data is string[][] =>
      Array.isArray(data) && data.length > 0 && typeof data[0][0] === "string",
    render: (data) => <TableFormat2 data={data} />,
  },
  varphi: {
    predicate: (data): data is string[][] =>
      Array.isArray(data) && data.length > 0 && typeof data[0][0] === "string",
    render: (data) => <TableFormat2 data={data} />,
  },
  iota: {
    predicate: (data): data is KeyedItem[] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <TableFormat1 data={data} />,
  },
  kappa: {
    predicate: (data): data is KeyedItem[] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <TableFormat1 data={data} />,
  },
  lambda: {
    predicate: (data): data is KeyedItem[] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <TableFormat1 data={data} />,
  },
  beta: {
    predicate: (data): data is BetaItem[] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <BetaTable data={data} />,
  },
  chi: {
    predicate: (data): data is ChiItem => data !== undefined && data !== null,
    render: (data) => <ChiTable data={[data]} />,
  },
  eta: {
    predicate: (data): data is string[] => Array.isArray(data),
    render: (data) => <EtaTable data={data} />,
  },
  gamma: {
    predicate: (data): data is GammaItem => data !== undefined && data !== null,
    render: (data) => <GammaTable data={[data]} />,
  },
  pi: {
    predicate: (data): data is PiItem => data !== undefined && data !== null,
    render: (data) => <PiTable data={data} />,
  },
  psi: {
    predicate: (data): data is PsiItem => data !== undefined && data !== null,
    render: (data) => <PsiTable data={data} />,
  },
  rho: {
    predicate: (data): data is RhoItem => data !== undefined && data !== null,
    render: (data) => <RhoTable data={data} headerHash={headerHash} />,
  },
  theta: {
    predicate: (data): data is ThetaItem =>
      Array.isArray(data) && data.flat(Infinity).length > 0,
    render: (data) => <ThetaTable data={data} headerHash={headerHash} />,
  },
  xi: {
    predicate: (data): data is string[][] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <XiTable data={data} />,
  },
  accounts: {
    predicate: (data): data is AccountItem[] =>
      Array.isArray(data) && data.length > 0,
    render: (data) => <AccountTable accounts={data} />,
  },
});

export const renderTable = (
  stateData: State,
  key: keyof State,
  headerHash: string
) => {
  const tableConfigs = getTableConfigs(headerHash);
  const config = tableConfigs[key];
  if (!config) return null;

  const data = stateData[key];
  if (config.predicate(data)) {
    return config.render(data);
  }
  return <Typography variant="body1">No data available.</Typography>;
};
