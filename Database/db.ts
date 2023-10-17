import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./Models/schema";

export const sqlite = new Database("./Database/db.sqlite");
export const db: BunSQLiteDatabase<typeof schema> = drizzle(sqlite, {
  schema,
});

export default db;
