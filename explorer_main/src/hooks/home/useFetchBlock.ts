import { Block } from "@/db/db";

export async function fetchBlock(
  searchValue: string,
  rpcUrl: string,
  type: "hash" | "slot"
): Promise<Block | null> {
  console.log(`[LOG] Fetching block for ${type}: `, searchValue);

  // Decide on method and parameter based on type.
  let methodName = "jam.GetBlockByHash";
  const paramValue: string = searchValue;

  if (type === "slot") {
    methodName = "jam.GetBlockBySlot";
    // Validate that searchValue represents a valid number,
    // but keep it as a string.
    if (isNaN(Number(searchValue))) {
      throw new Error("Invalid slot number");
    }
    // paramValue remains the string version of searchValue.
  }

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: methodName,
    params: [paramValue],
  };

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    //console.error("Error fetching block:", err);
    return null;
  }
}
