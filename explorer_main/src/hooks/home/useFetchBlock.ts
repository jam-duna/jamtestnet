export async function fetchBlock(hash: string, rpcUrl: string): Promise<any> {
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "jam_getBlockByHash",
    params: [hash],
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
