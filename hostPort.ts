export const parseHostPort = (hostPort: string) => {
  const [h, p] = hostPort.split(":");
  return {
    hostname: h || "127.0.0.1",
    port: p ? Number(p) : 3000,
  };
};
