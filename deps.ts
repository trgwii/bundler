export { encode } from "https://deno.land/std@0.76.0/encoding/ascii85.ts";
export {
  readVarnum,
  writeVarnum,
} from "https://deno.land/std@0.76.0/encoding/binary.ts";
export { copyN } from "https://deno.land/std@0.76.0/io/ioutil.ts";
export { compress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";

export const strings = {
  decode: "https://deno.land/std@0.76.0/encoding/ascii85.ts",
  decompress: "https://deno.land/x/brotli@v0.1.4/mod.ts",
  parse: "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts",
};
