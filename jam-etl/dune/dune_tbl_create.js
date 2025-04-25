#!/usr/bin/env node

/* Usage: dune_tbl_create.js [--dry-run] <schema.json> <table_name> [description] */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NL = '\n';
const LC = '\\';
const ENDPOINT_BASE = 'https://api.dune.com/api/v1/table';
const NAMESPACE = 'substrate';
const PROD = 'dune';
const ACTION = 'create';

async function main() {
    const argv = process.argv.slice(2);
    const dryRunIndex = argv.indexOf('--dry-run');
    const dryRun = dryRunIndex !== -1;
    if (dryRun) argv.splice(dryRunIndex, 1);

    const [schemaFile, tableName, description = ''] = argv;
    if (!schemaFile || !tableName) {
        console.error('Usage: create_dune_tbl.js [--dry-run] <schema.json> <table_name> [description]');
        process.exit(1);
    }

    const fullPath = path.resolve(schemaFile);
    if (!fs.existsSync(fullPath)) {
        console.error(`Schema file not found: ${fullPath}`);
        process.exit(1);
    }

    let schema;
    try {
        schema = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
        console.error(`Failed to parse JSON schema in ${fullPath}:`, err.message);
        process.exit(1);
    }

    const payload = {
        namespace: NAMESPACE,
        table_name: tableName,
        description: description || `JAM ${tableName}`,
        is_private: false,
        schema: schema
    };

    const ENDPOINT = `${ENDPOINT_BASE}/${ACTION}`;
    const DESTINATION = `${PROD}.${NAMESPACE}.${tableName}`

    if (dryRun) {
        const singleLine = JSON.stringify(payload);
        console.log(`${NL}--- [CREATE TABLE] ${DESTINATION} ---${NL}`);
        console.log([
            `curl -X POST '${ENDPOINT}' ${LC}`,
            `  -H "X-DUNE-API-KEY: $DUNE_API_KEY" ${LC}`,
            `  -H "Content-Type: application/json" ${LC}`,
            `  --data '${singleLine}'`
        ].join(NL), NL);
        process.exit(0);
    }

    const apiKey = process.env.DUNE_API_KEY;
    if (!apiKey) {
        console.error('❌ DUNE_API_KEY not set');
        process.exit(1);
    }

    try {
        const res = await axios.post(
            ENDPOINT,
            payload, {
                headers: {
                    'X-DUNE-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`✅ [${DESTINATION}] created:${NL}`, res.data);
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