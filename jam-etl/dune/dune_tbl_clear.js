#!/usr/bin/env node

/* Usage: dune_tbl_clear.js [--run] <table_name> */

require('dotenv').config();
const axios = require('axios');
const NL = '\n';
const LC = '\\';
const ENDPOINT_BASE = 'https://api.dune.com/api/v1/table';
const NAMESPACE = 'substrate';
const PROD = 'dune';
const ACTION = 'clear';

async function main() {
    const argv = process.argv.slice(2);
    const runIndex = argv.indexOf('--run');
    const doRun = runIndex !== -1;
    if (doRun) argv.splice(runIndex, 1);

    const [tableName] = argv;
    if (!tableName) {
        console.error('Usage: dune_tbl_clear.js [--run] <table_name>');
        process.exit(1);
    }

    const endpoint = `${ENDPOINT_BASE}/${NAMESPACE}/${tableName}/${ACTION}`;
    const destination = `${PROD}.${NAMESPACE}.${tableName}`;

    if (!doRun) {
        console.log(`${NL}--- [CLEAR TABLE] ${destination} ---${NL}`);
        console.log([
            `curl -X POST '${endpoint}' ${LC}`,
            `  -H "X-DUNE-API-KEY: $DUNE_API_KEY"`
        ].join(NL), NL);
        process.exit(0);
    }

    const apiKey = process.env.DUNE_API_KEY;
    if (!apiKey) {
        console.error('❌ DUNE_API_KEY not set');
        process.exit(1);
    }

    try {
        const res = await axios.post(endpoint, null, {
            headers: {
                'X-DUNE-API-KEY': apiKey
            }
        });
        console.log(`✅ [${destination}] cleared:${NL}`, res.data);
    } catch (err) {
        if (err.response) {
            console.error(`❌ [${destination}] API error:${NL}`, err.response.status, err.response.data);
        } else {
            console.error(`❌ [${destination}] Request failed:${NL}`, err.message);
        }
        process.exit(1);
    }
}

main();