// Full Node.js script to convert JAM telemetry JSONL into multiple files for Dune ingestion

const fs = require('fs');
const readline = require('readline');
const path = require('path');
const jamutil = require('./jamutil')

const OUTPUT_DIR = './dune_jam';
const DATA_DIR = './logs';

function extractMetadata(metaString) {
  const out = {};
  metaString.split('|').forEach(kv => {
    const [k, v] = kv.split('=');
    if (k && v) out[k.trim()] = v.trim();
  });
  return {
    team: out.team || 'unknown',
    sender_id: out.id || 'unknown'
  };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeRow(tableName, row) {
  const outPath = path.join(OUTPUT_DIR, `${tableName}.jsonl`);
  fs.appendFileSync(outPath, JSON.stringify(row) + '\n');
}

function handleBlock(parsed) {
    const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
    const meta = extractMetadata(metadata || '');
    const header = json_encoded.header;
    const extrinsic = json_encoded.extrinsic;
    const disputes = extrinsic.disputes || {};
  
    const row = {
      time,
      team: meta.team,
      sender_id: meta.sender_id,
      elapsed,
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
      codec_encoded,
    };
    writeRow('blocks', row);
  }
  
  function handleStatistics(parsed) {
    const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
    const meta = extractMetadata(metadata || '');
  
    json_encoded.vals_current.forEach((current, i) => {
      const last = json_encoded.vals_last[i];
      writeRow('validatorstatistics', {
        time,
        team: meta.team,
        sender_id: meta.sender_id,
        elapsed,
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
        codec_encoded,
      });
    });
  
    json_encoded.cores.forEach((core, i) => {
      writeRow('corestatistics', {
        time,
        team: meta.team,
        sender_id: meta.sender_id,
        elapsed,
        core: i,
        da_load: core.da_load,
        popularity: core.popularity,
        imports: core.imports,
        exports: core.exports,
        extrinsic_size: core.extrinsic_size,
        extrinsic_count: core.extrinsic_count,
        bundle_size: core.bundle_size,
        gas_used: core.gas_used,
        codec_encoded,
      });
    });
  
    (json_encoded.services || []).forEach(svc => {
      writeRow('servicestatistics', {
        time,
        team: meta.team,
        sender_id: meta.sender_id,
        elapsed,
        service_id: svc.id,
        ...svc.record,
        codec_encoded,
      });
    });
  }
  
  function handleWorkReport(parsed) {
    const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
    const meta = extractMetadata(metadata || '');
    const ps = json_encoded.package_spec;
    const ctx = json_encoded.context;
  
    writeRow('workreports', {
      time,
      team: meta.team,
      sender_id: meta.sender_id,
      elapsed,
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
      core_index: json_encoded.core_index,
      authorizer_hash: json_encoded.authorizer_hash,
      segment_root_lookup: JSON.stringify(json_encoded.segment_root_lookup),
      results: JSON.stringify(json_encoded.results),
      auth_gas_used: json_encoded.auth_gas_used,
      num_results: json_encoded.results.length,
      codec_encoded,
    });
}

function handlePreimage(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  writeRow('preimages', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    requester: json_encoded.requester,
    blob: json_encoded.blob,
    codec_encoded,
  });
}

function handleAssurance(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  writeRow('assurances', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    anchor: json_encoded.anchor,
    bitfield: json_encoded.bitfield,
    validator_index: json_encoded.validator_index,
    signature: json_encoded.signature,
    codec_encoded,
  });
}

function handleTicket(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  writeRow('tickets', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    attempt: json_encoded.attempt,
    signature: json_encoded.signature,
    codec_encoded,
  });
}

function handleWorkPackage(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  const ctx = json_encoded.context;
  writeRow('workpackages', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    authorization: json_encoded.authorization,
    auth_code_host: json_encoded.auth_code_host,
    authorization_code_hash: json_encoded.authorization_code_hash,
    parameterization_blob: json_encoded.parameterization_blob,
    anchor: ctx.anchor,
    state_root: ctx.state_root,
    beefy_root: ctx.beefy_root,
    lookup_anchor: ctx.lookup_anchor,
    lookup_anchor_slot: ctx.lookup_anchor_slot,
    prerequisites: ctx.prerequisites ? JSON.stringify(ctx.prerequisites) : null,
    work_items: JSON.stringify(json_encoded.items),
    codec_encoded,
  });
}

function handleNewService(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  writeRow('services', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    service_index: json_encoded.service_index,
    code_hash: json_encoded.code_hash,
    balance: json_encoded.balance,
    min_item_gas: json_encoded.min_item_gas,
    min_memo_gas: json_encoded.min_memo_gas,
    code_size: json_encoded.code_size,
    items: json_encoded.items,
    codec_encoded,
  });
}

function handleSegment(parsed) {
  const { time, json_encoded, elapsed, codec_encoded, metadata } = parsed;
  const meta = extractMetadata(metadata || '');
  writeRow('segments', {
    time,
    team: meta.team,
    sender_id: meta.sender_id,
    elapsed,
    work_package_hash: json_encoded.work_package_hash,
    index: json_encoded.index,
    data: json_encoded.data,
    codec_encoded,
  });
}

async function processLine(line) {
  try {
    const parsed = JSON.parse(line);
    const msg_type = parsed.msg_type;
    switch (msg_type) {
      case jamutil.msgTypeBlock: return handleBlock(parsed);
      case jamutil.msgTypeStatistics: return handleStatistics(parsed);
      case jamutil.msgTypeWorkReport: return handleWorkReport(parsed);
      case jamutil.msgTypePreimage: return handlePreimage(parsed);
      case jamutil.msgTypeAssurance: return handleAssurance(parsed);
      case jamutil.msgTypeTicket: return handleTicket(parsed);
      case jamutil.msgTypeWorkPackage: return handleWorkPackage(parsed);
      case jamutil.msgTypeNewService: return handleNewService(parsed);
      case jamutil.msgTypeSegment: return handleSegment(parsed);
      default: console.warn('Unhandled msg_type:', msg_type);
    }
  } catch (err) {
    console.error('Failed to process line:', err);
  }
}

async function exportAllFilesSequentially() {
  ensureDir(OUTPUT_DIR);
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.log')).sort();
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`Processing ${filePath}`);
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });
    for await (const line of rl) {
      await processLine(line);
    }
  }
  console.log('All logs processed into Dune-compatible JSONL files.');
    // TODO: import into Dune using upload JSON
}


// Usage:
exportAllFilesSequentially();
