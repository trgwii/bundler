import { extract } from "./extract.ts";
import { serverClient } from "./serverClient.ts";
import type { log } from "./types.ts";

export const receive = async (
  hostPort = "",
  path = new Date().toISOString().split("T")[0],
  log: log = () => {},
) => {
  const conn = await serverClient(hostPort, log);
  await extract(conn, path, log)
    .catch((err: Error) =>
      Deno.writeAll(conn, new TextEncoder().encode(err.message))
    )
    .then(() => conn.close());
};
