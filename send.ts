import { compress } from "./compress.ts";
import { writeVarnum } from "./deps.ts";
import { parseHostPort } from "./hostPort.ts";

export const send = async (
  path: string,
  remotePath: string,
  hostPort = "",
) => {
  const conn = await Deno.connect(parseHostPort(hostPort));
  const p = Deno.copy(conn, Deno.stdout);
  await writeVarnum(conn, 1);
  await writeVarnum(conn, 1);
  const remoteData = new TextEncoder().encode(remotePath);
  await writeVarnum(conn, remoteData.byteLength);
  await Deno.writeAll(conn, remoteData);
  await compress(path, conn);
};
