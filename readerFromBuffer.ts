export const readerFromBuffer = (data: Uint8Array): Deno.Reader => {
  let bytesWritten = 0;
  const read = async (out: Uint8Array) => {
    if (bytesWritten >= data.byteLength) {
      return null;
    }
    const bytes = Math.min(data.byteLength - bytesWritten, out.byteLength);
    const slice = data.subarray(
      bytesWritten,
      bytesWritten + bytes,
    );
    out.set(slice, 0);
    bytesWritten += bytes;
    return bytes;
  };
  return { read };
};
