import type { Client } from "#Structures/index.js";
import { Elysia } from "elysia";
import path from "path";
import fs from "fs";

export const start_API = (client: Client) => {
    const port = process.env.PORT;
    new Elysia()
    .get("/logs", ({ set }) => {
        set.headers["content-type"] = "application/json";
        return getLogs();
    })
    .listen(port);
    
    client.log(`API is open on port ${port}`)
}

function getLogs() {
    const logPath = path.join(__dirname, '..', 'Logging', 'logs.json');
    return fs.readFileSync(logPath, 'utf-8')
}