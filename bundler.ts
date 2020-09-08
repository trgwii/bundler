/*
root: 0 or 1 (file or dir)
	0:
		length of file buffer
			file buffer
	1:
		amount of entries
			length of name buffer
			name buffer
			(root)

deno install --allow-read=. --allow-write=. -n bundler bundler.ts
*/

import { compress } from "./compress.ts";
import { extract } from "./extract.ts";
import { load } from "./load.ts";
import { receive } from "./receive.ts";
import { send } from "./send.ts";
import { bundle } from "./types.ts";

export { compress, extract, load };

if (import.meta.main) {
  const [mode, ...args] = Deno.args;
  if (mode === "compress") {
    const [input, output] = args;
    const file = await Deno.open(output, { create: true, write: true });
    const bytes = await compress(input, file, console.log);
    console.log("[compress]", bytes, "bytes written to", output);
    file.close();
  } else if (mode === "extract") {
    const [input, output] = args;
    const file = await Deno.open(input);
    await extract(file, output, console.log);
    file.close();
  } else if (mode === "send") {
    const [input, output, hostPort] = args;
    await send(input, output, hostPort);
  } else if (mode === "receive") {
    const [hostPort, output] = args;
    await receive(hostPort, output);
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
    console.error("Available commands: compress, extract, send, receive, show");
  }
}
