import Dexie from "dexie";
import {
  Overview,
  Extrinsic,
  Header,
  KeyedItem,
  BetaItem,
  ChiItem,
  GammaItem,
  PiItem,
  PsiItem,
  RhoItem,
  ThetaItem,
  AccountItem,
} from "@/types";

// Full Block details combining header and extrinsic
export interface Block {
  header: Header;
  extrinsic: Extrinsic;
  overview?: Overview;
}

// State details
export interface State {
  alpha: string[][];
  beta: BetaItem[];
  chi: ChiItem;
  eta: string[];
  gamma: GammaItem;
  iota: KeyedItem[];
  kappa: KeyedItem[];
  lambda: KeyedItem[];
  pi: PiItem;
  psi: PsiItem;
  rho: RhoItem;
  tau: number;
  theta: ThetaItem;
  varphi: string[][];
  xi: string[][];
  accounts: AccountItem[] | null;
  overview?: Overview;
}

// Dexie database class
export class JamDB extends Dexie {
  public blocks!: Dexie.Table<Block, string>;
  public states!: Dexie.Table<State, string>;
  public blocksFetchBlockHash!: Dexie.Table<Block, string>;
  public statesFetchBlockHash!: Dexie.Table<State, string>;

  constructor() {
    super("JamDB");
    // Include "block.header.slot" so we can query by slot.
    this.version(1).stores({
      blocks: "overview.headerHash,overview.slot,overview.createdAt",
      states: "overview.headerHash,overview.slot,overview.createdAt",
      blocksFetchBlockHash: "overview.blockHash",
      statesFetchBlockHash: "overview.blockHash",
    });
  }
}

export const db = new JamDB();

export const DB_LIMIT = 30;
