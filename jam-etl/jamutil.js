const crypto = require('crypto');
const { createHash } = crypto;

// Message type constants (move to jamutil.js)
const msgTypeBlock = '128';
const msgTypeStatistics = '13';
const msgTypeWorkReport = '255';
const msgTypePreimage = '142';
const msgTypeAssurance = '141';
const msgTypeTicket = '131';
const msgTypeWorkPackage = '0';
const msgTypeNewService = '143';
const msgTypeSegment = '3';
const jceStartMs = Date.UTC(2025, 0, 1, 12, 0, 0) // JCE start: 2025-01-01T12:00:00Z
const secPerSlot = 6;

function isoToUnixSeconds(isoString) {
    const date = new Date(isoString);
    return Math.floor(date.getTime() / 1000);
}

function unixToJCE(unixSeconds) {
    const unixMs = unixSeconds * 1000;
    const diffMs = unixMs - jceStartMs;
    const diffSec = diffMs / 1000;
    return Math.floor(diffSec / secPerSlot);
}

function isoToJCE(isoString) {
    const dateMs = new Date(isoString).getTime();
    const diffMs = dateMs - jceStartMs;
    const diffSec = diffMs / 1000;
    return Math.floor(diffSec / secPerSlot);
}

function sha256(input) {
    var algo = 'sha256';
    return "0x" + createHash(algo).update(input).digest('hex');
}

function blake2b256AsHex(hexInput) {
  const clean = hexInput.replace(/^0x/, '');
  const data  = Buffer.from(clean, 'hex');
  const full = createHash('blake2b512').update(data).digest();
  const truncated = full.slice(0, 32); // first 32 bytes = 256 bits
  const hash = truncated.toString('hex');

  return '0x' + hash;
}

module.exports = {
    msgTypeBlock,
    msgTypeStatistics,
    msgTypeWorkReport,
    msgTypePreimage,
    msgTypeAssurance,
    msgTypeTicket,
    msgTypeWorkPackage,
    msgTypeNewService,
    msgTypeSegment,
    sha256,
    blake2b256AsHex,
    isoToUnixSeconds,
    isoToJCE
}