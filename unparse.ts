import { writeVarnum } from "https://deno.land/std@0.68.0/encoding/binary.ts";
import { bundle } from "./types.ts";

export const unparse = async (data: bundle, output: Deno.Writer) => {
  let bytes = 0;
  if (data instanceof Uint8Array) {
    bytes += await writeVarnum(output, 0);
    bytes += await writeVarnum(output, data.byteLength);
    await Deno.writeAll(output, data);
    bytes += data.byteLength;
  } else {
    bytes += await writeVarnum(output, 1);
    bytes += await writeVarnum(output, Object.keys(data).length);
    for (const [name, bundle] of Object.entries(data)) {
      const nameData = new TextEncoder().encode(name);
      bytes += await writeVarnum(output, nameData.byteLength);
      await Deno.writeAll(output, nameData);
      bytes += nameData.byteLength;
      bytes += await unparse(bundle, output);
    }
  }
  return bytes;
};
