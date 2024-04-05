import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { StatUser } from "..";

export const MangaStats = sqliteTable("mangastats", {
  id: integer("id", { mode: "number" }).unique().primaryKey({ autoIncrement: true }),

  mediaId: integer("mediaId", { mode: "number" }).unique().notNull(),
  users: text("users", { mode: "json" }).$type<StatUser[]>().notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export default MangaStats;
