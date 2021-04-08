/*
root: 0 or 1 (file or dir) (uint8)
	0:
		length of file buffer (uint64)
			file buffer
	1:
		amount of entries (uint64)
			length of name buffer (uint8)
			name buffer
			(root)

deno install -f --allow-read --allow-write -n bundler bundler.ts
*/

import { compress } from "./compress.ts";
import { extract } from "./extract.ts";
import { load } from "./load.ts";
import { parse } from "./parse.ts";
import { receive } from "./receive.ts";
import { send } from "./send.ts";
import { tsBundle } from "./tsBundle.ts";
import type { bundle } from "./types.ts";
import { unparse } from "./unparse.ts";
import { human } from "./size.ts";
import { ast } from "./ast.ts";
import { PassThrough } from "./passthrough.ts";

export { compress, extract, load, parse };
export type { bundle };

const outOptions: Deno.OpenOptions = {
  create: true,
  write: true,
  truncate: true,
};

if (import.meta.main) {
  const [mode, ...args] = Deno.args;
  if (mode === "compress") {
    const [input, output] = args;
    const file = await Deno.open(output, outOptions);
    const bytes = await compress(input, file, console.log);
    console.log("[compress]", human(bytes), "bytes written to", output);
    file.close();
  } else if (mode === "extract") {
    const [input, output] = args;
    const file = await Deno.open(input);
    await extract(file, output, console.log);
    file.close();
  } else if (mode === "ts-bundle") {
    const [input, output] = args;
    const ps = new PassThrough();
    const compressor = compress(input, ps, console.log);
    const outFile = await Deno.open(output, outOptions);
    const bundler = tsBundle(ps, outFile, await ast(input));
    await compressor;
    ps.close();
    await bundler;
    outFile.close();
  } else if (mode === "ts-extract") {
    const [input, output] = args;
    const { default: data } = await import(input);
    const tmpFileName = output + ".bin.tmp";
    const outTmpFile = await Deno.open(tmpFileName, outOptions);
    await unparse(await data, outTmpFile);
    outTmpFile.close();
    const tmpFile = await Deno.open(tmpFileName);
    await extract(tmpFile, output);
    tmpFile.close();
    Deno.remove(tmpFileName);
  } else if (mode === "send") {
    const [input, output, hostPort] = args;
    await send(input, output, hostPort, console.log);
  } else if (mode === "receive") {
    const [hostPort, output] = args;
    await receive(hostPort, output, console.log);
  } else if (mode === "show") {
    const [input] = args;
    const file = await Deno.open(input);
    const data = await load(file);
    file.close();
    await (async function display(data: bundle, i: number) {
      if (data instanceof Uint8Array) {
        await Deno.writeAll(
          Deno.stdout,
          new TextEncoder().encode(data.byteLength + " bytes\n"),
        );
      } else {
        for (const [k, v] of Object.entries(data)) {
          await Deno.writeAll(
            Deno.stdout,
            new TextEncoder().encode(
              " ".repeat(i) + k + (v instanceof Uint8Array ? ": " : "/\n"),
            ),
          );
          await display(v, i + 1);
        }
      }
    })(data, 0);
  } else {
    console.error(
      "Available commands: compress, extract, ts-bundle, ts-extract, send, receive, show",
    );
  }
}
