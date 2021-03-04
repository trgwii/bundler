import { write } from "./utils.ts";
import type { log } from "./types.ts";
import { human } from "./size.ts";

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
    log("[compress] file with size", human(stat.size) + ":", inPath);
    n += await write(output, 0);
    n += await write(output, BigInt(stat.size));
    const file = await Deno.open(inPath);
    n += await Deno.copy(file, output);
    file.close();
  }
  if (stat.isDirectory) {
    n += await write(output, 1);
    const entries: string[] = [];
    for await (const ent of Deno.readDir(inPath)) {
      entries.push(ent.name);
    }
    log("[compress] dir with", entries.length, "entries");
    n += await write(output, BigInt(entries.length));
    for await (const name of entries) {
      const nameBytes = new TextEncoder().encode(name);
      n += await write(output, nameBytes.byteLength);
      await Deno.writeAll(output, nameBytes);
      n += nameBytes.byteLength;
      n += await compress(`${inPath}/${name}`, output, log);
    }
  }
  return n;
};
