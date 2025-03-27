import { State } from "@/db/db";

export async function fetchState(
  hash: string,
  rpcUrl: string
): Promise<State | null> {
  console.log("[LOG] Fetching state for hash: ", hash);
  const payload = {
    jsonrpc: "2.0",
    id: 2,
    method: "jam.GetState",
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
    //console.error("Error fetching state:", err);
    return null;
  }
}
