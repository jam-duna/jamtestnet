export function getRpcUrlFromWs(wsEndpoint: string): string {
  if (wsEndpoint.startsWith("ws://")) {
    return "http://" + wsEndpoint.slice(5).replace(/\/ws$/, "/rpc");
  } else if (wsEndpoint.startsWith("wss://")) {
    return "https://" + wsEndpoint.slice(6).replace(/\/ws$/, "/rpc");
  }
  return wsEndpoint;
}
