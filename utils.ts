import { readVarbig, readVarnum, writeVarbig, writeVarnum } from "./deps.ts";

export const readBig = (s: Deno.Reader) =>
  readVarbig(s, { dataType: "uint64" });

export const readSmall = (s: Deno.Reader) =>
  readVarnum(s, { dataType: "uint8" });

export const write = (s: Deno.Writer, n: number | bigint) =>
  typeof n === "bigint"
    ? writeVarbig(s, n, { dataType: "uint64" })
    : writeVarnum(s, n, { dataType: "uint8" });
