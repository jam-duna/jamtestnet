export async function fetchBlockBySlot(
  slot: number,
  rpcUrl: string
): Promise<any> {
  console.log("fetching block for slot: ", slot);
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "jam.GetBlockBySlot",
    params: [slot],
  };
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    console.error("Error fetching block:", err);
    return null;
  }
}
