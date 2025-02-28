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
