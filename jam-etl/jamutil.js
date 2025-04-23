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

// temporary scaffolding
function hash(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

