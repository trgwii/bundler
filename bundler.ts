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

export { compress, extract, load };

if (import.meta.main) {
  const [mode, input, output] = Deno.args;
  if (mode === "compress") {
    await compress(
      input,
      await Deno.open(output, { create: true, write: true }),
      console.log,
    ).then((bytes) =>
      console.log("[compress]", bytes, "bytes written to", output)
    );
  } else if (mode === "extract") {
    await extract(await Deno.open(input), output, console.log);
  }
}
