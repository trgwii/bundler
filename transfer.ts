import { compress } from "./compress.ts";
import { extract } from "./extract.ts";
import { serverClient } from "./serverClient.ts";
import { PassThrough } from "./passthrough.ts";
import type { log } from "./types.ts";

export const transfer = async (
  inputStr: string,
  outputStr: string,
  log: log = () => {},
) => {
  const input = inputStr.includes(":")
    ? await serverClient(inputStr, log)
    : new PassThrough();
  const compressor = input instanceof PassThrough
    ? compress(inputStr, input, log)
    : Promise.resolve(0);
  const output = outputStr.includes(":")
    ? await serverClient(outputStr, log)
    : new PassThrough();
  const extractor = output instanceof PassThrough
    ? extract(output, outputStr, log)
    : Promise.resolve();
  const p = Deno.copy(input, output);
  await compressor;
  await extractor;
  input.close();
  await p;
};
