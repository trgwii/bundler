import { readVarnum } from "./deps.ts";
import { getBytes } from "./getBytes.ts";
import type { bundle, log } from "./types.ts";

export const load = async (
  input: Deno.Reader,
  log: log = () => {},
): Promise<bundle> => {
  const isFile = (await readVarnum(input)) === 0;
  if (isFile) {
    const length = await readVarnum(input);
    log("[load] file with length", length);
    const data = await getBytes(length, input);
    return data;
  } else {
    const entries = await readVarnum(input);
    log("[load] dir with", entries, "entries");
    const res: { [k: string]: bundle } = {};
    for (let i = 0; i < entries; i++) {
      const nameLength = await readVarnum(input);
      const name = new TextDecoder().decode(
        await getBytes(nameLength, input),
      );
      log("[load] entry:", name);
      res[name] = await load(input, log);
    }
    return res;
  }
};
