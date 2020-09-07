export const getBytes = async (n: number, input: Deno.Reader) => {
  const data = new Uint8Array(n);
  let read = 0;
  do {
    const bytes = await input.read(data.subarray(read));
    if (typeof bytes !== "number") {
      throw new Deno.errors.UnexpectedEof("whoops");
    }
    read += bytes;
  } while (read < n);
  return data;
};
