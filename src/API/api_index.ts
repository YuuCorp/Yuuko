import type { Client } from "#Structures/index.js";
import { Elysia, t } from "elysia";
import { GET_logs } from "./handlers";

export const start_API = (client: Client) => {
    const port = process.env.PORT;
    const YuukoLog = t.Array(t.Object( { date: t.String(), user: t.String(), info: t.String() } ))
    
    new Elysia()
    .get("/logs", ({ set }) => GET_logs(set), { response: YuukoLog })
    .get("announcements", () => "Get Announcements")
    .get("stats", () => "Get Stats")
    .post("announcements", () => "Upload Announcement")
    .post("restart", () => "Restart Bot")   // this would restart the API as well due to how it's currently initialized
    .post("update", () => "Update Bot")     // ^ same issue, we wouldn't be able to update that the event happened succesfully
    .post("wipe-logs", () => "Wipe Logs")
    .listen(port);
    
    client.log(`API is open on port ${port}`)
}