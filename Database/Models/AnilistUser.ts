import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, numeric, integer } from "drizzle-orm/sqlite-core";
import { userBirthday } from ".";

export const anilistUser = sqliteTable("anilistuser", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  discordId: text("discord_id", {
    length: 18,
  })
    .notNull()
    .unique(),
  anilistToken: text("anilist_token", {
    length: 3000,
  })
    .notNull()
    .unique(),
  anilistId: integer("anilist_id").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export default anilistUser;
