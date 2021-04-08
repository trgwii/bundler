import { compress } from "./compress.ts";
import { write } from "./utils.ts";
import { serverClient } from "./serverClient.ts";
import type { log } from "./types.ts";

export const send = async (
  path: string,
  remotePath: string,
  hostPort = "",
  log: log = () => {},
) => {
  const conn = await serverClient(hostPort, log);
  const p = Deno.copy(conn, Deno.stdout);
  await write(conn, 1);
  await write(conn, 1n);
  const remoteData = new TextEncoder().encode(remotePath);
  await write(conn, remoteData.byteLength);
  await Deno.writeAll(conn, remoteData);
  await compress(path, conn, log);
  await p;
  conn.close();
};
