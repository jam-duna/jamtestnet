// db.ts
import Dexie from "dexie";

// Define interfaces for your stored records.
export interface BlockRecord {
  id?: number; // auto-increment primary key
  headerHash: string;
  slot: number;
  parent: string;
  authorIndex: number;
  seal: string;
  entropySource: string;
}

export interface StateRecord {
  id?: number;
  bandersnatch: string;
  ed25519: string;
  bls: string;
  metadata: string;
}

// Create a Dexie database instance.
export class JamDB extends Dexie {
  public blocks!: Dexie.Table<BlockRecord, number>;
  public states!: Dexie.Table<StateRecord, number>;

  constructor() {
    super("JamDB");
    this.version(1).stores({
      blocks: "++id, headerHash, slot, parent",
      states: "++id, bandersnatch",
    });
  }
}

export const db = new JamDB();
