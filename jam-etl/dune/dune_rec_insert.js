#!/usr/bin/env node

/* Usage:
   dune_rec_insert.js [--dry-run] <ndjson_file> <table_name>
*/

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NL = '\n';
const LC = '\\';
const ENDPOINT_BASE = 'https://api.dune.com/api/v1/table';
const NAMESPACE = 'substrate';
const PROD = 'dune';
const ACTION = 'insert';


async function main() {
    const argv = process.argv.slice(2);
    const dryIndex = argv.indexOf('--dry-run');
    const dryRun = dryIndex !== -1;
    if (dryRun) argv.splice(dryIndex, 1);

    const [ndjsonFile, tableName] = argv;
    if (!ndjsonFile || !tableName) {
        console.error('Usage: dune_rec_insert.js [--dry-run] <ndjson_file> <table_name>');
        process.exit(1);
    }

    const filePath = path.resolve(ndjsonFile);
    if (!fs.existsSync(filePath)) {
        console.error(`NDJSON file not found: ${filePath}`);
        process.exit(1);
    }

    const ENDPOINT = `${ENDPOINT_BASE}/${NAMESPACE}/${tableName}/${ACTION}`;
    const DESTINATION = `${PROD}.${NAMESPACE}.${tableName}`

    if (dryRun) {
        console.log(`${NL}--- [INSERT RECORDS] ${DESTINATION} ---${NL}`);
        console.log([
            `curl -X POST '${ENDPOINT}' ${LC}`,
            `  -H "X-DUNE-API-KEY: $DUNE_API_KEY" ${LC}`,
            `  -H "Content-Type: application/x-ndjson" ${LC}`,
            `  --upload-file ${ndjsonFile}`
        ].join(NL));
        process.exit(0);
    }

    const apiKey = process.env.DUNE_API_KEY;
    if (!apiKey) {
        console.error('❌ DUNE_API_KEY not set in environment');
        process.exit(1);
    }

    let ndjson;
    try {
        ndjson = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Failed to read ${filePath}:`, err.message);
        process.exit(1);
    }

    try {
        const res = await axios.post(
            ENDPOINT,
            ndjson, {
                headers: {
                    'X-DUNE-API-KEY': apiKey,
                    'Content-Type': 'application/x-ndjson'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            }
        );
        console.log(`✅ [${DESTINATION}] Records inserted:${NL}`, res.data);
    } catch (err) {
        if (err.response) {
            console.error(`❌ [${DESTINATION}] API error:${NL}`, err.response.status, err.response.data);
        } else {
            console.error(`❌ [${DESTINATION}] Request failed:${NL}`, err.message);
        }
        process.exit(1);
    }
}

main();