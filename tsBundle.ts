import { encode } from "./deps.ts";

const enc = (x: string) => new TextEncoder().encode(x);

export const tsBundle = async (input: Deno.Reader, output: Deno.Writer) => {
  await output.write(enc(
    [
      'import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";',
      'import { decode } from "https://deno.land/std@0.69.0/encoding/ascii85.ts";',
    ].join("\n") + "\n",
  ));
  await output.write(enc('export default parse(decode("'));

  let first = true;

  const buf = await Deno.readAll(input);
  await Deno.writeAll(output, enc(encode(buf, { standard: "Z85" })));

  await output.write(enc('", { standard: "Z85" }));\n'));
};
