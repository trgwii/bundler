import { readVarnum } from "./deps.ts";
import { getBytes } from "./getBytes.ts";
export const load = async (input, log = () => { }) => {
    const isFile = (await readVarnum(input)) === 0;
    if (isFile) {
        const length = await readVarnum(input);
        log("[load] file with length", length);
        const data = await getBytes(length, input);
        return data;
    }
    else {
        const entries = await readVarnum(input);
        log("[load] dir with", entries, "entries");
        const res = {};
        for (let i = 0; i < entries; i++) {
            const nameLength = await readVarnum(input);
            const name = new TextDecoder().decode(await getBytes(nameLength, input));
            log("[load] entry:", name);
            res[name] = await load(input, log);
        }
        return res;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN2QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEtBQWtCLEVBQ2xCLE1BQVcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUNGLEVBQUU7SUFDbkIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxJQUFJLE1BQU0sRUFBRTtRQUNWLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNO1FBQ0wsTUFBTSxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxNQUFNLEdBQUcsR0FBNEIsRUFBRSxDQUFDO1FBQ3hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQ25DLE1BQU0sUUFBUSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FDbEMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sR0FBRyxDQUFDO0tBQ1o7QUFDSCxDQUFDLENBQUMifQ==