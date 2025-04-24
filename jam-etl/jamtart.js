const crypto = require('crypto');

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
const jceStart = Date.UTC(2025, 0, 1, 12, 0, 0) // JCE start: 2025-01-01T12:00:00Z

function isoToUnixSeconds(isoString) {
    const date = new Date(isoString);
    return Math.floor(date.getTime() / 1000);
}

function unixToJCE(unixSeconds) {
    //const jceStartSec = Date.UTC(2025, 0, 1, 12, 0, 0) / 1000;
    const diffSec = unixSeconds - jceStart;
    return Math.floor(diffSec / 6);
}

function isoToJCE(isoString) {
    const date = new Date(isoString);
    const unixSeconds = Math.floor(date.getTime() / 1000);
    return unixToJCE(unixSeconds);
}

function hash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
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
    hash,
    isoToUnixSeconds,
    isoToJCE
}