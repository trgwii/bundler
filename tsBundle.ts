const enc = (x: string) => new TextEncoder().encode(x);

export const tsBundle = async (input: Deno.Reader, output: Deno.Writer) => {
  await output.write(
    enc(
      'import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";\n',
    ),
  );
  await output.write(enc('export default parse(new Uint8Array(JSON.parse("['));

  let first = true;

  for await (const chunk of Deno.iter(input)) {
    if (first) {
      await Deno.writeAll(output, enc(chunk.toString()));
      first = false;
    } else {
      await Deno.writeAll(output, enc("," + chunk.toString()));
    }
  }
  await output.write(enc(']")));\n'));
};
