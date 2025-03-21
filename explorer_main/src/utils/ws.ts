export function getRpcUrlFromWs(wsEndpoint: string): string {
  let urlStr = wsEndpoint.trim();
  // Determine the HTTP protocol based on the current page.
  const pageProtocol =
    typeof window !== "undefined" && window.location?.protocol
      ? window.location.protocol
      : "http:";
  const httpProtocol = pageProtocol === "https:" ? "https://" : "http://";

  // If the input doesn't start with a WebSocket protocol, prepend the appropriate HTTP protocol.
  if (!urlStr.startsWith("ws://") && !urlStr.startsWith("wss://")) {
    urlStr = httpProtocol + urlStr;
  } else {
    // If a WebSocket protocol exists, convert it to its HTTP counterpart.
    urlStr = urlStr
      .replace(/^ws:\/\//, "http://")
      .replace(/^wss:\/\//, "https://");
  }

  try {
    const parsed = new URL(urlStr);
    // Convert the pathname: if it ends with "/ws", change it to "/rpc".
    if (parsed.pathname.endsWith("/ws")) {
      parsed.pathname = parsed.pathname.replace(/\/ws$/, "/rpc");
    } else if (parsed.pathname === "/" || parsed.pathname === "") {
      // If no explicit path is provided, default to "/rpc".
      parsed.pathname = "/rpc";
    }
    return parsed.toString();
  } catch (error) {
    // Fallback: Remove trailing slashes and add "/rpc" if necessary.
    urlStr = urlStr.replace(/\/+$/, "");
    if (urlStr.endsWith("/ws")) {
      urlStr = urlStr.replace(/\/ws$/, "/rpc");
    } else {
      urlStr = urlStr + "/rpc";
    }

    console.log("rpc endpoint: ", urlStr);

    return urlStr;
  }
}

// Helper function to normalize endpoints.
export function normalizeEndpoint(input: string): string {
  let url = input.trim();
  // Determine the protocol of the current page.
  const pageProtocol =
    typeof window !== "undefined" && window.location?.protocol
      ? window.location.protocol
      : "http:";
  // Set WebSocket protocol based on the page protocol.
  const wsProtocol = pageProtocol === "https:" ? "wss://" : "ws://";

  // If no WebSocket protocol is provided, prepend the appropriate one.
  if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
    url = wsProtocol + url;
  } else {
    // Replace existing ws/wss protocol with the appropriate one.
    url = url.replace(/^(wss?:\/\/)/, wsProtocol);
  }

  try {
    const parsed = new URL(url);
    // Ensure the pathname is '/ws'
    if (parsed.pathname !== "/ws") {
      parsed.pathname = "/ws";
    }
    return parsed.toString();
  } catch (error) {
    // Fallback: remove trailing slashes and add "/ws" if necessary.
    url = url.replace(/\/+$/, "");
    if (!url.endsWith("/ws")) {
      url = url + "/ws";
    }
    return url;
  }
}
