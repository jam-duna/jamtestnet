export function getRpcUrlFromWs(wsEndpoint: string): string {
  console.log("endpoint: " + wsEndpoint);

  let url: URL;
  try {
    // Try to parse as is.
    console.log("valid protocol...");
    url = new URL(wsEndpoint);
  } catch {
    // If no valid protocol, assume it's missing and prepend "http://"
    console.log("not valid protocol...");
    url = new URL("http://" + wsEndpoint);
  }
  // Convert websocket protocols to their HTTP counterparts.
  if (url.protocol === "ws:") {
    url.protocol = "http:";
  } else if (url.protocol === "wss:") {
    url.protocol = "https:";
  }
  // Replace a trailing "/ws" with "/rpc" if present.
  if (url.pathname.endsWith("/ws")) {
    url.pathname = url.pathname.replace(/\/ws$/, "/rpc");
  }
  return url.toString();
}
