// --- Interfaces ---

// Package specification
export interface PackageSpec {
  hash: string;
  length: number;
  erasure_root: string;
  exports_root: string;
  exports_count: number;
}

// Context information
export interface Context {
  anchor: string;
  state_root: string;
  beefy_root: string;
  lookup_anchor: string;
  lookup_anchor_slot: number;
  prerequisites?: string[];
}

//
export interface Result {
  service_id: number;
  code_hash: string;
  payload_hash: string;
  accumulate_gas: number;
  result: { ok?: string };
}

//
export interface SegmentRootLookup {
  segment_tree_root: string;
  work_package_hash: string;
}

// ! Report structure
export interface Report {
  auth_output: string;
  authorizer_hash: string;
  context: Context;
  core_index: number;
  package_spec: PackageSpec;
  results: Result[];
  segment_root_lookup: SegmentRootLookup[];
}

// Guarantee signature
export interface GuaranteeSignature {
  signature: string;
  validator_index: number;
}

// Guarantee work report object
export interface Guarantee {
  report: Report;
  signatures: GuaranteeSignature[];
  slot: number;
}

// Ticket interface
export interface Ticket {
  attempt: number;
  signature: string;
}

// Assurance interface
export interface Assurance {
  anchor: string;
  bitfield: string;
  signature: string;
  validator_index: number;
}

// Preimage interface
export interface Preimage {
  blob: string;
  requester: number;
}

// Disputes interface
export interface Disputes {
  verdicts: unknown[];
  culprits: unknown[];
  faults: unknown[];
}

// Extrinsic interface combining all arrays
export interface Extrinsic {
  tickets: Ticket[];
  disputes?: Disputes | null;
  assurances: Assurance[];
  guarantees: Guarantee[];
  preimages: Preimage[];
}

//
export interface AccordionSubSection {
  title: string;
  count: number;
  children: React.ReactNode;
}

//
export interface JamState {
  alpha: string[][];
  varphi: string[][];
  beta: BetaItem[];
  gamma: Gamma;
  psi: Psi;
  eta: string[];
  iota: KeyedItem[];
  kappa: KeyedItem[];
  lambda: KeyedItem[];
}

export interface BetaItem {
  header_hash: string;
  mmr: {
    peaks: (string | null)[];
  };
  state_root: string;
  reported: {
    work_package_hash: string;
    segment_tree_root: string;
  }[];
}

export interface Gamma {
  gamma_k: KeyedItem[];
  gamma_z: string;
  gamma_s: {
    tickets: {
      id: string;
      attempt: number;
    }[];
  };
  gamma_a: {
    id: string;
    attempt: number;
  }[];
}

export interface Psi {
  good: any[];
  bad: any[];
  wonky: any[];
  offenders: any[];
}

export interface KeyedItem {
  bandersnatch: string;
  ed25519: string;
  bls: string;
  metadata: string;
}
