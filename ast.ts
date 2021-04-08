export type AST = null | { [k: string]: AST };

export const ast = async (path: string): Promise<AST> => {
  const stat = await Deno.stat(path);
  if (stat.isSymlink) {
    throw new TypeError("Symlinks not implemented");
  }
  if (stat.isDirectory) {
    const entries: AST = {};
    for await (const ent of Deno.readDir(path)) {
      entries[ent.name] = await ast(`${path}/${ent.name}`);
    }
    return entries;
  }
  return null;
};

export const type = (ast: AST): string => {
  if (ast === null) {
    return "Uint8Array";
  }

  return "{ " +
    Object.entries(ast).map(([k, v]) =>
      `${/^\w+$/.test(k) && !/^\d+/.test(k) ? k : `"${k}"`}: ${type(v)}`
    ).join(", ") + " }";
};
