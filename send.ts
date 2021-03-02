import { compress } from "./compress.ts";
import { writeVarbig } from "./deps.ts";
import { parseHostPort } from "./hostPort.ts";
import type { log } from "./types.ts";

export const send = async (
  path: string,
  remotePath: string,
  hostPort = "",
  log: log = () => {},
) => {
  const conn = await Deno.connect(parseHostPort(hostPort));
  const p = Deno.copy(conn, Deno.stdout);
  await writeVarbig(conn, 1n);
  await writeVarbig(conn, 1n);
  const remoteData = new TextEncoder().encode(remotePath);
  await writeVarbig(conn, BigInt(remoteData.byteLength));
  await Deno.writeAll(conn, remoteData);
  await compress(path, conn, log);
};
