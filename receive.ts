import { extract } from "./extract.ts";
import { parseHostPort } from "./hostPort.ts";

export const receive = async (
  hostPort = "",
  path = new Date().toISOString().split("T")[0],
) => {
  for await (const conn of Deno.listen(parseHostPort(hostPort))) {
    extract(conn, path)
      .catch((err: Error) =>
        Deno.writeAll(conn, new TextEncoder().encode(err.message))
      )
      .then(() => conn.close());
  }
};
