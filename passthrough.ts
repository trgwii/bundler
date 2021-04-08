const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type log = (...args: unknown[]) => void;

export class PassThrough implements Deno.Reader, Deno.Writer, Deno.Closer {
  #read: number = 0;
  #write: number = 0;
  #end: boolean = false;
  #buf: Uint8Array;
  #log: log;
  constructor(size = 1024 * 32, log: log = () => {}) {
    this.#buf = new Uint8Array(size);
    this.#log = log;
  }
  async read(p: Uint8Array): Promise<number | null> {
    await sleep(0);
    if (this.#read === this.#write) {
      if (this.#end) {
        return null;
      }
      return 0;
    }
    let bytes = Math.min(
      (this.#write - this.#read + this.#buf.byteLength) % this.#buf.byteLength,
      p.byteLength,
    );
    for (let i = 0; i < bytes; i++) {
      p[i] = this.#buf[this.#read];
      this.#read = (this.#read + 1) % this.#buf.byteLength;
    }
    this.#log("read", bytes);
    return bytes;
  }
  async write(p: Uint8Array): Promise<number> {
    await sleep(0);
    if (this.#end) {
      return 0;
    }
    if (
      this.#write === (
        (this.#read + this.#buf.byteLength - 1) %
        this.#buf.byteLength
      )
    ) {
      return 0;
    }
    const bytes = Math.min(
      (this.#buf.byteLength - (this.#write - this.#read) - 1) %
        this.#buf.byteLength,
      p.byteLength,
    );
    for (let i = 0; i < bytes; i++) {
      this.#buf[this.#write] = p[i];
      this.#write = (this.#write + 1) % this.#buf.byteLength;
    }
    this.#log("write", bytes);
    return bytes;
  }
  close() {
    this.#log("close");
    this.#end = true;
  }
}
