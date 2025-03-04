export function truncateHash(hash: string): string {
  // Ensure we have a leading "0x"
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;

  // We'll take 8 hex chars (4 bytes) at the start and 8 at the end
  if (clean.length <= 16) {
    // If it's too short, just return it
    return "0x" + clean;
  }
  const prefix = clean.slice(0, 8);
  const suffix = clean.slice(-8);
  return `0x${prefix}...${suffix}`;
}

export function getRelativeTime(timestamp: number, now = Date.now()): string {
  const secondsAgo = Math.floor((now - timestamp) / 1000);
  if (secondsAgo < 0) return "0 sec";
  if (secondsAgo < 60) return `${secondsAgo} sec${secondsAgo !== 1 ? "s" : ""}`;
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} min${minutes !== 1 ? "s" : ""}`;
  }
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  const days = Math.floor(secondsAgo / 86400);
  return `${days} day${days !== 1 ? "s" : ""}`;
}

export function pluralize(word: string, count: number): string {
  return count !== 1 ? word + "s" : word;
}
