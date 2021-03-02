import { writeVarnum } from "./deps.ts";
export const unparse = async (data, output) => {
    let bytes = 0;
    if (data instanceof Uint8Array) {
        bytes += await writeVarnum(output, 0);
        bytes += await writeVarnum(output, data.byteLength);
        await Deno.writeAll(output, data);
        bytes += data.byteLength;
    }
    else {
        bytes += await writeVarnum(output, 1);
        bytes += await writeVarnum(output, Object.keys(data).length);
        for (const [name, bundle] of Object.entries(data)) {
            const nameData = new TextEncoder().encode(name);
            bytes += await writeVarnum(output, nameData.byteLength);
            await Deno.writeAll(output, nameData);
            bytes += nameData.byteLength;
            bytes += await unparse(bundle, output);
        }
    }
    return bytes;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5wYXJzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVucGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUd4QyxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLElBQVksRUFBRSxNQUFtQixFQUFFLEVBQUU7SUFDakUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxJQUFJLFlBQVksVUFBVSxFQUFFO1FBQzlCLEtBQUssSUFBSSxNQUFNLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLE1BQU0sV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUMxQjtTQUFNO1FBQ0wsS0FBSyxJQUFJLE1BQU0sV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxLQUFLLElBQUksTUFBTSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEQsS0FBSyxJQUFJLE1BQU0sV0FBVyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0QyxLQUFLLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQztZQUM3QixLQUFLLElBQUksTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQyJ9