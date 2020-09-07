import { copyN, readVarnum } from "./deps.ts";
import { getBytes } from "./getBytes.ts";
import type { log } from "./types.ts";

export const extract = async (
  input: Deno.Reader,
  outPath: string,
  log: log = () => {},
) => {
  const isFile = (await readVarnum(input)) === 0;
  if (isFile) {
    const length = await readVarnum(input);
    log("[extract] file with length", length);
    await copyN(
      input,
      await Deno.open(outPath, { create: true, write: true }),
      length,
    );
  } else {
    await Deno.mkdir(outPath);
    const entries = await readVarnum(input);
    log("[extract] dir with", entries, "entries");
    for (let i = 0; i < entries; i++) {
      const nameLength = await readVarnum(input);
      const name = new TextDecoder().decode(
        await getBytes(nameLength, input),
      );
      log("[extract] entry:", name);
      await extract(input, `${outPath}/${name}`, log);
    }
  }
};
