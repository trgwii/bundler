import { compress, encode } from "./deps.ts";

const enc = (x: string) => new TextEncoder().encode(x);

export const tsBundle = async (input: Deno.Reader, output: Deno.Writer) => {
  await output.write(enc(
    [
      'import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";',
      'import { decode } from "https://deno.land/std@0.70.0/encoding/ascii85.ts";',
      'import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";',
    ].join("\n") + "\n",
  ));
  await output.write(enc('export default parse(decompress(decode("'));

  let first = true;

  const buf = await Deno.readAll(input);
  await Deno.writeAll(output, enc(encode(compress(buf), { standard: "Z85" })));

  await output.write(enc('", { standard: "Z85" })));\n'));
};
