import { readVarbig } from "./deps.ts";
import { getBytes } from "./getBytes.ts";
import type { bundle, log } from "./types.ts";

export const load = async (
  input: Deno.Reader,
  log: log = () => {},
): Promise<bundle> => {
  const isFile = (await readVarbig(input)) === 0n;
  if (isFile) {
    const length = Number(await readVarbig(input));
    log("[load] file with length", length);
    const data = await getBytes(length, input);
    return data;
  } else {
    const entries = Number(await readVarbig(input));
    log("[load] dir with", entries, "entries");
    const res: { [k: string]: bundle } = {};
    for (let i = 0; i < entries; i++) {
      const nameLength = Number(await readVarbig(input));
      const name = new TextDecoder().decode(
        await getBytes(nameLength, input),
      );
      log("[load] entry:", name);
      res[name] = await load(input, log);
    }
    return res;
  }
};
