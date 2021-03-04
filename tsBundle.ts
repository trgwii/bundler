import { compress, encode, strings } from "./deps.ts";
import type { AST } from "./ast.ts";
import { ast, type } from "./ast.ts";

const enc = (x: string) => new TextEncoder().encode(x);

export const tsBundle = async (
  input: Deno.Reader,
  output: Deno.Writer,
  ast?: AST,
) => {
  await output.write(enc(
    [
      'import { decode } from "' + strings.decode + '";',
      'import { decompress } from "' + strings.decompress + '";',
      'import { parse } from "' + strings.parse + '";',
    ].join("\n") + "\n",
  ));
  await output.write(
    enc('export default parse(\n  decompress(\n    decode(\n      "'),
  );

  const buf = await Deno.readAll(input);
  await Deno.writeAll(output, enc(encode(compress(buf), { standard: "Z85" })));

  await output.write(enc('",\n      { standard: "Z85" },\n    ),\n  ),\n)'));
  if (ast === undefined) {
    await output.write(enc(";\n"));
    return;
  }
  await output.write(enc(` as Promise<${type(ast)}>;\n`));
};
