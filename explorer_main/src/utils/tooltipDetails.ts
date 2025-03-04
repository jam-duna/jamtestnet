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
  alpha: {
    label: "Authorizations Pool",
    tooltip:
      "A list of authorization hashes for each core (c0 to c15) that determines which operations are allowed.",
  },
  beta: {
    label: "Recent Blocks",
    tooltip:
      "A record of the most recent blocks processed by the network, used to verify chain continuity.",
  },
  chi: {
    label: "Privileged Service Indices",
    tooltip:
      "Indices identifying services with special permissions in the network.",
  },
  eta: {
    label: "ETA Data",
    tooltip:
      "Estimated time or additional timing details (subject to further clarification).",
  },
  gamma: {
    label: "Safrole State Gamma",
    tooltip: "Core state data related to the Safrole consensus component.",
  },
  iota: {
    label: "Iota Data",
    tooltip:
      "Additional state information labeled as Iota; details may be refined in future documentation.",
  },
  kappa: {
    label: "Kappa Data",
    tooltip:
      "Additional state information labeled as Kappa; details are subject to further clarification.",
  },
  lambda: {
    label: "Lambda Data",
    tooltip:
      "Additional state information labeled as Lambda; further documentation is forthcoming.",
  },
  pi: {
    label: "Validator Statistics",
    tooltip: "Performance and operational data for network validators.",
  },
  psi: {
    label: "Disputes State",
    tooltip:
      "Information regarding network disputes and potential misbehavior incidents.",
  },
  rho: {
    label: "Availability Assignments",
    tooltip:
      "Data describing how tasks or data assignments are distributed across nodes.",
  },
  tau: {
    label: "Current Epoch",
    tooltip:
      "The current epoch or time period used for state transitions and reward calculations.",
  },
  theta: {
    label: "Accumulation Queue",
    tooltip:
      "A queue of pending accumulation operations that are waiting to be processed.",
  },
  varphi: {
    label: "Varphi Data",
    tooltip:
      "Additional state details labeled as Varphi; more details will be provided in future updates.",
  },
  xi: {
    label: "Accumulation History",
    tooltip:
      "Historical data of past accumulation operations, useful for auditing and reward distribution.",
  },
};
