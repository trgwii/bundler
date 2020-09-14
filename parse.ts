import { load } from "./load.ts";
import { readerFromBuffer } from "./readerFromBuffer.ts";

export const parse = (data: Uint8Array) => load(readerFromBuffer(data));
