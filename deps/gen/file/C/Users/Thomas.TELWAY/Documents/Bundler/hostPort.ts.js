export const parseHostPort = (hostPort) => {
    const [h, p] = hostPort.split(":");
    return {
        hostname: h || "127.0.0.1",
        port: p ? Number(p) : 3000,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdFBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob3N0UG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDaEQsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLE9BQU87UUFDTCxRQUFRLEVBQUUsQ0FBQyxJQUFJLFdBQVc7UUFDMUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO0tBQzNCLENBQUM7QUFDSixDQUFDLENBQUMifQ==