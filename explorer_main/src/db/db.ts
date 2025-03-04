import Dexie from "dexie";

// Overview data
export interface Overview {
  blockHash: string;
  createdAt: number;
}

// Block header details
export interface BlockHeader {
  author_index: number;
  entropy_source: string;
  epoch_mark: any; // typically null
  extrinsic_hash: string;
  offenders_mark: any[]; // array (contents depend on your data)
  parent: string;
  parent_state_root: string;
  seal: string;
  slot: number;
  tickets_mark: any; // typically null
}

// Block extrinsic details
export interface Extrinsic {
  tickets: any[];
  disputes: {
    verdicts: any[];
    culprits: any[];
    faults: any[];
  };
  guarantees: any[];
  preimages: any[];
  assurances: any[];
}

// Full Block details combining header and extrinsic
export interface Block {
  header: BlockHeader;
  extrinsic: Extrinsic;
}

// State details
export interface State {
  alpha: any[];
  upvrht: any[];
  beta: any[];
  gamma: any;
  psi: any;
  chi: any;
  tau: number;
  rho: any[];
  eta: any[];
  iota: any[];
  kappa: any[];
  lambda: any[];
  theta: any[];
  xi: any[];
  varphi: any[];
  pi: any;
  accounts: any;
  [key: string]: any;
}

// BlockRecord: the complete record stored in Dexie, uniquely identified by headerHash.
export interface BlockRecord {
  headerHash: string; // primary key
  overview: Overview;
  block: Block;
}

// StateRecord.
export interface StateRecord {
  headerHash: string; // primary key
  overview: Overview;
  state: State;
}

// Dexie database class
export class JamDB extends Dexie {
  public blocks!: Dexie.Table<BlockRecord, string>;
  public states!: Dexie.Table<StateRecord, string>;

  constructor() {
    super("JamDB");
    // Include "block.header.slot" so we can query by slot.
    this.version(1).stores({
      blocks: "headerHash,block.header.slot",
      states: "headerHash",
    });
  }
}

export const db = new JamDB();
