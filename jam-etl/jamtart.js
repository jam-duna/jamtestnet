const crypto = require("crypto");

function extractMetadata(metaString) {
  const out = {};
  metaString.split("|").forEach((kv) => {
    const [k, v] = kv.split("=");
    if (k && v) out[k.trim()] = v.trim();
  });
  return {
    team: out.team || "unknown",
    sender_id: out.id || "unknown",
  };
}

module.exports = {
  msgTypeBlock: "128",
  msgTypeStatistics: "13",
  msgTypeWorkReport: "255",
  msgTypePreimage: "142",
  msgTypeAssurance: "141",
  msgTypeTicket: "131",
  msgTypeWorkPackage: "0",
  msgTypeNewService: "143",
  msgTypeSegment: "3",
  extractMetadata,
  // temp
  hash: (input) => crypto.createHash("sha256").update(input).digest("hex"),
};
