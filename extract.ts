import { copyN } from "./deps.ts";
import { readBig, readSmall } from "./utils.ts";

import { getBytes } from "./getBytes.ts";
import type { log } from "./types.ts";
import { human } from "./size.ts";

export const extract = async (
  input: Deno.Reader,
  outPath: string,
  log: log = () => {},
) => {
  const isFile = (await readSmall(input)) === 0;
  if (isFile) {
    const length = Number(await readBig(input));
    log("[extract] file with size", human(length));
    const file = await Deno.open(outPath, { create: true, write: true });
    await copyN(input, file, length);
    file.close();
  } else {
    await Deno.mkdir(outPath, { recursive: true });
    const entries = Number(await readBig(input));
    log("[extract] dir with", entries, "entries");
    for (let i = 0; i < entries; i++) {
      const nameLength = await readSmall(input);
      const name = new TextDecoder().decode(await getBytes(nameLength, input));
      log("[extract] entry:", name);
      await extract(input, `${outPath}/${name}`, log);
    }
  }
};
