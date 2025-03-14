export function truncateHash(hash: string): string {
  const clean = hash.startsWith("0x") ? hash.slice(2) : hash;

  if (clean.length <= 16) {
    return "0x" + clean;
  }
  const prefix = clean.slice(0, 8);
  const suffix = clean.slice(-8);
  return `0x${prefix}...${suffix}`;
}

export function getRelativeTime(timestamp: number, now = Date.now()): string {
  const secondsAgo = Math.floor((now - timestamp) / 1000);
  if (secondsAgo < 0) return "0 sec";
  if (secondsAgo < 60) return `${secondsAgo} ${pluralize("sec", secondsAgo)}`;
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} ${pluralize("min", minutes)}`;
  }
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} ${pluralize("hour", hours)}`;
  }
  const days = Math.floor(secondsAgo / 86400);
  return `${days} ${pluralize("day", days)}`;
}

export function pluralize(word: string, count: number): string {
  return count !== 1 ? word + "s" : word;
}
