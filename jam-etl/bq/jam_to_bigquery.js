// jam-to-bigquery.js
// Reads a JSONL file containing telemetry messages (of different msgTypes)
// and streams them into BigQuery.

const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { BigQuery } = require("@google-cloud/bigquery");
const jamtart = require("../jamtart");

const bigquery = new BigQuery({ projectId: "awesome-web3" });
const DATA_DIR = "./logs";
const LASTFILE_PATH = "bigquery-lastfile.txt";
const dataset = "jam";

const removeUndefinedFields = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

const insertRow = async (table, row) => {
  try {
    await bigquery.dataset(dataset).table(table).insert(removeUndefinedFields(row));
  } catch (e) {
    console.error("❌ BigQuery Insert Error:");
    if (e.name === "PartialFailureError" && e.errors) {
      for (const entry of e.errors) {
        console.error("Failed Row:", entry.row);
        for (const err of entry.errors) {
          console.error("Reason:", err.reason);
          console.error("Message:", err.message);
        }
      }
    } else {
      console.error(e);
    }
  }
};

const parseMetaRow = (parsed) => {
  const meta = jamtart.extractMetadata(parsed.metadata || "");
  return {
    time: parsed.time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed: parsed.elapsed,
    codec_encoded: parsed.codec_encoded,
  };
};

async function handleBlock(parsed) {
  const metaRow = parseMetaRow(parsed);
  const header = parsed.json_encoded.header;
  const extrinsic = parsed.json_encoded.extrinsic;
  const disputes = extrinsic.disputes || {};
  await insertRow("blocks", {
    ...metaRow,
    parent: header.parent,
    parent_state_root: header.parent_state_root,
    extrinsic_hash: header.extrinsic_hash,
    slot: header.slot,
    author_index: header.author_index,
    entropy_source: header.entropy_source,
    seal: header.seal,
    num_tickets: extrinsic.tickets?.length || 0,
    num_preimages: extrinsic.preimages?.length || 0,
    num_guarantees: extrinsic.guarantees?.length || 0,
    num_assurances: extrinsic.assurances?.length || 0,
    num_verdicts: disputes.verdicts?.length || 0,
    num_culprits: disputes.culprits?.length || 0,
    num_faults: disputes.faults?.length || 0,
  });
}

async function handleStatistics(parsed) {
  const metaRow = parseMetaRow(parsed);
  const j = parsed.json_encoded;

  j.vals_current.forEach(async (current, i) => {
    const last = j.vals_last[i];
    await insertRow("validatorstatistics", {
      ...metaRow,
      validator_id: i,
      current_blocks: current.blocks,
      current_tickets: current.tickets,
      current_pre_images: current.pre_images,
      current_pre_images_size: current.pre_images_size,
      current_guarantees: current.guarantees,
      current_assurances: current.assurances,
      last_blocks: last.blocks,
      last_tickets: last.tickets,
      last_pre_images: last.pre_images,
      last_pre_images_size: last.pre_images_size,
      last_guarantees: last.guarantees,
      last_assurances: last.assurances,
    });
  });

  j.cores.forEach(async (core, i) => {
    await insertRow("corestatistics", {
      ...metaRow,
      core: i,
      ...core,
    });
  });

  (j.services || []).forEach(async (svc) => {
    await insertRow("servicestatistics", {
      ...metaRow,
      service_id: svc.id,
      ...svc.record,
    });
  });
}

async function handleWorkReport(parsed) {
  const metaRow = parseMetaRow(parsed);
  const j = parsed.json_encoded;
  const ps = j.package_spec;
  const ctx = j.context;

  await insertRow("workreports", {
    ...metaRow,
    work_package_hash: ps.hash,
    bundle_length: ps.length,
    erasure_root: ps.erasure_root,
    exports_root: ps.exports_root,
    exports_count: ps.exports_count,
    anchor: ctx.anchor,
    state_root: ctx.state_root,
    beefy_root: ctx.beefy_root,
    lookup_anchor: ctx.lookup_anchor,
    lookup_anchor_slot: ctx.lookup_anchor_slot,
    prerequisites: ctx.prerequisites ? JSON.stringify(ctx.prerequisites) : null,
    core_index: j.core_index,
    authorizer_hash: j.authorizer_hash,
    segment_root_lookup: JSON.stringify(j.segment_root_lookup),
    results: JSON.stringify(j.results),
    auth_gas_used: j.auth_gas_used,
    num_results: j.results.length,
  });
}

async function handlePreimage(parsed) {
  const metaRow = parseMetaRow(parsed);
  await insertRow("preimages", {
    ...metaRow,
    requester: parsed.json_encoded.requester,
    blob: parsed.json_encoded.blob,
  });
}

async function handleAssurance(parsed) {
  const metaRow = parseMetaRow(parsed);
  const j = parsed.json_encoded;
  await insertRow("assurances", {
    ...metaRow,
    anchor: j.anchor,
    bitfield: j.bitfield,
    validator_index: j.validator_index,
    signature: j.signature,
  });
}

async function handleTicket(parsed) {
  const metaRow = parseMetaRow(parsed);
  await insertRow("tickets", {
    ...metaRow,
    attempt: parsed.json_encoded.attempt,
    signature: parsed.json_encoded.signature,
  });
}


async function handleWorkPackageBundle(parsed) {
  const metaRow = parseMetaRow(parsed);
  const bundle = parsed.json_encoded;
  const wp = bundle.work_package;
  const ctx = wp.context || {};
  const work_package_hash = jamtart.hash(JSON.stringify(bundle));

  await insertRow("workpackagebundles", {
    ...metaRow,
    work_package_hash,
    authorization: wp.authorization,
    auth_code_host: wp.auth_code_host,
    authorization_code_hash: wp.authorization_code_hash,
    parameterization_blob: wp.parameterization_blob,
    anchor: ctx.anchor,
    state_root: ctx.state_root,
    beefy_root: ctx.beefy_root,
    lookup_anchor: ctx.lookup_anchor,
    lookup_anchor_slot: ctx.lookup_anchor_slot,
    prerequisites: ctx.prerequisites ? JSON.stringify(ctx.prerequisites) : null,
    work_items: JSON.stringify(wp.items || []),
    extrinsics: JSON.stringify(bundle.extrinsics),
    import_segments: JSON.stringify(bundle.import_segments),
    justifications: JSON.stringify(bundle.justifications),
  });
}

async function handleNewService(parsed) {
  const metaRow = parseMetaRow(parsed);
  const j = parsed.json_encoded;
  await insertRow("services", {
    ...metaRow,
    service_index: j.service_index,
    code_hash: j.code_hash,
    balance: j.balance,
    min_item_gas: j.min_item_gas,
    min_memo_gas: j.min_memo_gas,
    code_size: j.code_size,
    items: j.items,
  });
}

async function handleSegment(parsed) {
  const metaRow = parseMetaRow(parsed);
  await insertRow("segments", {
    ...metaRow,
    work_package_hash: parsed.json_encoded.work_package_hash,
    index: parsed.json_encoded.index,
    data: parsed.json_encoded.data,
  });
}

async function processLine(line) {
  try {
    const parsed = JSON.parse(line);
    switch (parsed.msg_type) {
      case jamtart.msgTypeBlock: return handleBlock(parsed);
      case jamtart.msgTypeStatistics: return handleStatistics(parsed);
      case jamtart.msgTypeWorkReport: return handleWorkReport(parsed);
      case jamtart.msgTypePreimage: return handlePreimage(parsed);
      case jamtart.msgTypeAssurance: return handleAssurance(parsed);
      case jamtart.msgTypeTicket: return handleTicket(parsed);
      case jamtart.msgTypeWorkPackageBundle: return handleWorkPackageBundle(parsed);
      case jamtart.msgTypeNewService: return handleNewService(parsed);
      case jamtart.msgTypeSegment: return handleSegment(parsed);
      default:
        console.warn("Unhandled msg_type:", parsed.msg_type);
    }
  } catch (err) {
      console.error("Failed to process line:", err, line);
  }
}

async function streamFileToBigQuery(filename) {
  const fullPath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fullPath)) return console.error(`❌ File not found: ${fullPath}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(fullPath),
    crlfDelay: Infinity,
  });
  for await (const line of rl) await processLine(line);
  console.log(`✅ Done streaming ${filename}`);
  fs.writeFileSync(LASTFILE_PATH, filename, "utf-8");
}

function getNextMinuteFile(currentFile) {
  const match = currentFile.match(/^(\d{2})(\d{2})\.log$/);
  if (!match) return null;
  let hour = +match[1], minute = +match[2];
  if (hour === 23 && minute === 59) return null;
  if (++minute === 60) [minute, hour] = [0, hour + 1];
  return `${hour.toString().padStart(2, "0")}${minute.toString().padStart(2, "0")}.log`;
}

function findNextAvailableFile(fromFile) {
  let current = fromFile;
  while (true) {
    const next = getNextMinuteFile(current);
    if (!next) return null;
    if (fs.existsSync(path.join(DATA_DIR, next))) return next;
    current = next;
  }
}

(async () => {
  let filename = process.argv[2];
  if (!filename) {
    if (!fs.existsSync(LASTFILE_PATH)) return console.error("❌ No input file and no bigquery-lastfile.txt found.");
    const last = fs.readFileSync(LASTFILE_PATH, "utf-8").trim();
    const next = findNextAvailableFile(last);
      if (!next) {
	  return console.error("🎉 Finished processing all available logs.");

      }
    filename = next;
    console.log(`📂 Resuming: ${last} → ${filename}`);
  }
  await streamFileToBigQuery(filename);
})();
