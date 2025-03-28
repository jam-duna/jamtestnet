export async function fetchService(id: string, rpcUrl: string): Promise<any> {
    const payload = {
      jsonrpc: "2.0",
      id: 2,
      method: "jam.GetService",
      params: [id],
    };
    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (err) {
      //console.error("Error fetching service:", err);
      return null;
    }
  }
  