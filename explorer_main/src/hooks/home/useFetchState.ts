export async function fetchState(
  headerHash: string,
  rpcUrl: string
): Promise<any> {
  const payload = {
    jsonrpc: "2.0",
    id: 2,
    method: "jam_getState",
    params: [headerHash],
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    console.error("Error fetching state:", err);
    return null;
  }
}
