import Dexie from "dexie";

// Define interfaces for stored records.
export interface BlockRecord {
  id?: number;
  blockHash: string; // Full block hash (e.g. fetchedBlock.hash)
  headerHash: string; // Header hash (e.g. fetchedBlock.header.extrinsic_hash)
  slot: number;
  rawData: any; // The full fetchedBlock object
  createdAt?: number; // Timestamp when the block was received
}

export interface StateRecord {
  id?: number;
  blockHash: string; // Common identifier linking this state to the block
  rawData: any; // The full state data (could be an object or array)
}

export class JamDB extends Dexie {
  public blocks!: Dexie.Table<BlockRecord, number>;
  public states!: Dexie.Table<StateRecord, number>;

  constructor() {
    super("JamDB");
    // Upgrade the database version to include the new "createdAt" field for blocks.
    this.version(2).stores({
      blocks: "++id, blockHash, headerHash, slot, createdAt",
      states: "++id, blockHash",
    });
  }
}

export const db = new JamDB();
