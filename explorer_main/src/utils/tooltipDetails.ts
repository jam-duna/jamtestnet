// home
export const basicInfoMapping = {
  blockHeight: {
    label: "Block Height:",
    tooltip: "The slot or number representing the height of this block.",
  },
  blockHash: {
    label: "Block Hash:",
    tooltip: "A unique cryptographic identifier for this block.",
  },
  headerHash: {
    label: "Header Hash:",
    tooltip: "The unique hash of the block header.",
  },
  createdDate: {
    label: "Created Date:",
    tooltip: "The timestamp (in local time) when this block was recorded.",
  },
  authorIndex: {
    label: "Author Index:",
    tooltip:
      "The validator index (or block producer ID) who created this block.",
  },
  workReport: {
    label: "Work Report:",
    tooltip:
      "Indicates how many 'guarantees' are in the extrinsic. They often represent work packages or tasks.",
  },
};

export const jamStateMapping: Record<
  string,
  { label: string; tooltip: string }
> = {
  accounts: {
    label: "Accounts",
    tooltip: "Accounts: Description is here.",
  },
  alpha: {
    label: "Authorizations Pool (C1)",
    tooltip:
      "Alpha (C1): A list of authorization hashes for each core (c0 to c15) that determines which operations are allowed.",
  },
  beta: {
    label: "Recent Blocks (C3)",
    tooltip:
      "Beta (C3): A record of the most recent blocks processed by the network, used to verify chain continuity.",
  },
  chi: {
    label: "Privileged Service Indices (C12)",
    tooltip:
      "Chi (C12): Indices identifying services with special permissions in the network.",
  },
  eta: {
    label: "Entropy (C6)",
    tooltip:
      "Eta (C6): Estimated time or additional timing details (subject to further clarification).",
  },
  gamma: {
    label: "Safrole State Gamma (C4)",
    tooltip:
      "Gamma (C4): Core state data related to the Safrole consensus component.",
  },
  iota: {
    label: "Iota Data (C7)",
    tooltip:
      "Iota (C7): Additional state information labeled as Iota; details may be refined in future documentation.",
  },
  kappa: {
    label: "Kappa Data (C8)",
    tooltip:
      "Kappa (C8): Additional state information labeled as Kappa; details are subject to further clarification.",
  },
  lambda: {
    label: "Lambda Data (C9)",
    tooltip:
      "Lambda (C1): Additional state information labeled as Lambda; further documentation is forthcoming.",
  },
  pi: {
    label: "Validator Statistics (C13)",
    tooltip:
      "Pi (C13): Performance and operational data for network validators.",
  },
  psi: {
    label: "Disputes State (C5)",
    tooltip:
      "Psi (C5): Information regarding network disputes and potential misbehavior incidents.",
  },
  rho: {
    label: "Availability Assignments (C10)",
    tooltip:
      "Rho (C10): Data describing how tasks or data assignments are distributed across nodes.",
  },
  tau: {
    label: "Current Epoch (C11)",
    tooltip:
      "Tau (C11): The current epoch or time period used for state transitions and reward calculations.",
  },
  theta: {
    label: "Accumulation Queue (C14)",
    tooltip:
      "Theta (C14): A queue of pending accumulation operations that are waiting to be processed.",
  },
  varphi: {
    label: "Authorization Queue (C2)",
    tooltip:
      "Varphi (C2): Additional state details labeled as Varphi; more details will be provided in future updates.",
  },
  xi: {
    label: "Accumulation History (C15)",
    tooltip:
      "Xi (C15): Historical data of past accumulation operations, useful for auditing and reward distribution.",
  },
};

export const moreDetailsMapping: Record<
  string,
  { label: string; tooltip: string }
> = {
  parent: {
    label: "Parent:",
    tooltip: "Hash of the previous block in the chain.",
  },
  parent_state_root: {
    label: "Parent State Root:",
    tooltip: "Merkle root summarizing the entire state after the parent block.",
  },
  seal: {
    label: "Seal:",
    tooltip:
      "A cryptographic seal containing the block producer's signature and possibly VRF data.",
  },
  entropy_source: {
    label: "Entropy Source:",
    tooltip:
      "Used to provide randomness for the protocol. Typically not crucial for end-users.",
  },
};

export const workReportMapping = {
  basicInfo: [
    {
      label: "Header Hash:",
      tooltip: "Block header hash. Click to view block details.",
    },
    {
      label: "Slot:",
      tooltip: "Slot number for the work report's block.",
    },
    {
      label: "Core Index:",
      tooltip: "Index of the core that processed the work report.",
    },
    {
      label: "Report Status:",
      tooltip: "Status of the work report.",
    },
  ],
  packageSpec: [
    {
      label: "Work Package Hash:",
      tooltip:
        "Unique identifier of the work report derived from the package specification.",
    },
    {
      label: "Length:",
      tooltip: "Length of the package spec in bytes.",
    },
    {
      label: "Erasure Root:",
      tooltip: "Erasure root hash for data recovery.",
    },
    {
      label: "Exports Root:",
      tooltip: "Exports root hash for the package.",
    },
    {
      label: "Exports Count:",
      tooltip: "Number of exports available in the package spec.",
    },
  ],
  context: [
    {
      label: "Anchor:",
      tooltip: "Context anchor used to tie the state data.",
    },
    {
      label: "State Root:",
      tooltip: "Root hash of the block's state.",
    },
    {
      label: "Beefy Root:",
      tooltip: "Beefy consensus protocol root hash.",
    },
    {
      label: "Lookup Anchor:",
      tooltip: "Anchor used for lookup operations.",
    },
    {
      label: "Lookup Anchor Slot:",
      tooltip: "Slot corresponding to the lookup anchor.",
    },
    {
      label: "Prerequisites:",
      tooltip: "List of prerequisite hashes required for context.",
    },
  ],
  authorization: [
    {
      label: "Authorizer Hash:",
      tooltip: "Hash of the entity that authorized this work report.",
    },
    {
      label: "Auth Output:",
      tooltip: "Output generated by the authorization process.",
    },
  ],
  accounts: {
    label: "Accounts",
    tooltip: "Accounts: Accounts Description.",
  },
};
