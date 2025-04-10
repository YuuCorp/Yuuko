import { drizzle } from "drizzle-orm/bun-sqlite";
import { type InferSelectModel } from "drizzle-orm";
import { Database } from "bun:sqlite";

import * as schema from "#models/index";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

export const tables = {
    ...schema
};

export const sqlite = new Database("./src/database/sqlite/db.sqlite");
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle({
    client: sqlite,
    schema: tables,
});

// magic that allows us to get a table as a type
export type InferTable<T extends keyof typeof tables> = (typeof tables)[T] extends SQLiteTable ? InferSelectModel<typeof tables[T]> : never;