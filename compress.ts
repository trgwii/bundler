import { writeVarnum } from "./deps.ts";
import { log } from "./types.ts";

export const compress = async (
  inPath: string,
  output: Deno.Writer,
  log: log = () => {},
): Promise<number> => {
  let n = 0;
  const stat = await Deno.stat(inPath);
  if (stat.isSymlink) {
    throw new TypeError("Symlinks not implemented");
  }
  if (stat.isFile) {
    log("[compress] file", inPath, "with length", stat.size);
    n += await writeVarnum(output, 0);
    n += await writeVarnum(output, stat.size);
    n += await Deno.copy(await Deno.open(inPath), output);
  }
  if (stat.isDirectory) {
    n += await writeVarnum(output, 1);
    const entries: string[] = [];
    for await (const ent of Deno.readDir(inPath)) {
      entries.push(ent.name);
    }
    log("[compress] dir with", entries.length, "entries");
    n += await writeVarnum(output, entries.length);
    for await (const name of entries) {
      const nameBytes = new TextEncoder().encode(name);
      n += await writeVarnum(output, nameBytes.byteLength);
      await Deno.writeAll(output, nameBytes);
      n += nameBytes.byteLength;
      n += await compress(`${inPath}/${name}`, output, log);
    }
  }
  return n;
};
