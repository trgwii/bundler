import { cyan } from "https://deno.land/std@0.89.0/fmt/colors.ts";

export const prefixes = {
  PiB: 2 ** 50,
  TiB: 2 ** 40,
  GiB: 2 ** 30,
  MiB: 2 ** 20,
  KiB: 2 ** 10,
};

export const round = (x: number, digits = 3) => {
  const pow = 10 ** digits;
  return Math.round(x * pow) / pow;
};

export const human = (x: number) => {
  const pair = Object.entries(prefixes).find(([k, v]) => v <= x);
  if (pair) {
    const [k, v] = pair;
    return cyan(`${round(x / v)}${k}`);
  }
  return cyan(`${x}B`);
};
