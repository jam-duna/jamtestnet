// db.ts
import Dexie from "dexie";

// Define interfaces for your stored records.
export interface BlockRecord {
  id?: number; // auto-increment primary key
  headerHash: string;
  timestamp: string;
  transactions: number;
}

export interface StateRecord {
  id?: number;
  headerHash: string;
  // Add other state properties as needed.
}

// Create a Dexie database instance.
export class JamDB extends Dexie {
  public blocks!: Dexie.Table<BlockRecord, number>;
  public states!: Dexie.Table<StateRecord, number>;

  constructor() {
    super("JamDB");
    this.version(1).stores({
      blocks: "++id, headerHash, timestamp",
      states: "++id, headerHash",
    });
  }
}

export const db = new JamDB();
