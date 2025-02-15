import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import * as schema from "#models/index";

export const tables = {
    ...schema
};

export const sqlite = new Database("./src/database/sqlite/db.sqlite");
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle({
    client: sqlite,
    schema: tables,
});