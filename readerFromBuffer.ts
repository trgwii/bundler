export const readerFromBuffer = (data: Uint8Array): Deno.Reader => {
  let bytesWritten = 0;
  const read = async (out: Uint8Array) => {
    const slice = data.subarray(bytesWritten, bytesWritten + out.byteLength);
    const bytes = slice.byteLength;
    out.set(slice, 0);
    return Promise.resolve(bytes);
  };
  return { read };
};
