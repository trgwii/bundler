import { parseHostPort } from "./hostPort.ts";
import type { log } from "./types.ts";

export const serverClient = async (hostPort: string, log: log = () => {}) => {
  const parsedHostPort = parseHostPort(hostPort);
  try {
    const server = Deno.listen(parsedHostPort);
    log(`Running as server (listen ${hostPort})`);
    for await (const conn of server) {
      return conn;
    }
  } catch (err) {
    log(`Running as client (connect ${hostPort})`);
    return Deno.connect(parsedHostPort);
  }
  // Help to make TypeScript understand that the above cases always return
  throw new Error("[serverClient] this should never happen");
};
