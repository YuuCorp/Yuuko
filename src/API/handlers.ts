import { type Context } from "elysia";
import path from "path";
import fs from "fs";

function readLogFile() {
    const logPath = path.join(__dirname, '..', 'Logging', 'logs.json');
    return JSON.parse(fs.readFileSync(logPath, 'utf-8'));
}

export function GET_logs(set: Context['set']) {
    set.headers["content-type"] = "application/json";
    set.status = 200;
    return readLogFile();
};