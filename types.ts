export type bundle = Uint8Array | { [k: string]: bundle };
export type log = (...args: any[]) => void;
