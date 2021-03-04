import { readBig, readSmall } from "./utils.ts";
import { getBytes } from "./getBytes.ts";
import type { bundle, log } from "./types.ts";
import { human } from "./size.ts";

export const load = async (
  input: Deno.Reader,
  log: log = () => {},
): Promise<bundle> => {
  const isFile = (await readSmall(input)) === 0;
  if (isFile) {
    const length = Number(await readBig(input));
    log("[load] file with size", human(length));
    const data = await getBytes(length, input);
    return data;
  } else {
    const entries = Number(await readBig(input));
    log("[load] dir with", entries, "entries");
    const res: { [k: string]: bundle } = {};
    for (let i = 0; i < entries; i++) {
      const nameLength = await readSmall(input);
      const name = new TextDecoder().decode(
        await getBytes(nameLength, input),
      );
      log("[load] entry:", name);
      res[name] = await load(input, log);
    }
    return res;
  }
};
