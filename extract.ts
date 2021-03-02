import { copyN, readVarbig } from "./deps.ts";
import { getBytes } from "./getBytes.ts";
import type { log } from "./types.ts";

export const extract = async (
  input: Deno.Reader,
  outPath: string,
  log: log = () => {},
) => {
  const isFile = (await readVarbig(input)) === 0n;
  if (isFile) {
    const length = Number(await readVarbig(input));
    log("[extract] file with length", length);
    const file = await Deno.open(outPath, { create: true, write: true });
    await copyN(input, file, length);
    file.close();
  } else {
    await Deno.mkdir(outPath, { recursive: true });
    const entries = Number(await readVarbig(input));
    log("[extract] dir with", entries, "entries");
    for (let i = 0; i < entries; i++) {
      const nameLength = Number(await readVarbig(input));
      const name = new TextDecoder().decode(await getBytes(nameLength, input));
      log("[extract] entry:", name);
      await extract(input, `${outPath}/${name}`, log);
    }
  }
};
