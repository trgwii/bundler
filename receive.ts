import { extract } from "./extract.ts";
import { parseHostPort } from "./hostPort.ts";
import type { log } from "./types.ts";

export const receive = async (
  hostPort = "",
  path = new Date().toISOString().split("T")[0],
  log: log = () => {},
) => {
  for await (const conn of Deno.listen(parseHostPort(hostPort))) {
    extract(conn, path, log)
      .catch((err: Error) =>
        Deno.writeAll(conn, new TextEncoder().encode(err.message))
      )
      .then(() => conn.close());
  }
};
