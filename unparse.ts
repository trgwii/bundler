import { writeVarbig } from "./deps.ts";
import type { bundle } from "./types.ts";

export const unparse = async (data: bundle, output: Deno.Writer) => {
  let bytes = 0;
  if (data instanceof Uint8Array) {
    bytes += await writeVarbig(output, 0n);
    bytes += await writeVarbig(output, BigInt(data.byteLength));
    await Deno.writeAll(output, data);
    bytes += data.byteLength;
  } else {
    bytes += await writeVarbig(output, 1n);
    bytes += await writeVarbig(output, BigInt(Object.keys(data).length));
    for (const [name, bundle] of Object.entries(data)) {
      const nameData = new TextEncoder().encode(name);
      bytes += await writeVarbig(output, BigInt(nameData.byteLength));
      await Deno.writeAll(output, nameData);
      bytes += nameData.byteLength;
      bytes += await unparse(bundle, output);
    }
  }
  return bytes;
};
