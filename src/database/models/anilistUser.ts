import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, } from "drizzle-orm/sqlite-core";
import { mediaStats } from "./mediaStats";

export const aniListUser = sqliteTable("anilistusers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  discordId: text("discord_id", {
    length: 18,
  })
    .notNull()
    .unique(),
  aniListToken: text("anilist_token", {
    length: 3000,
  })
    .notNull()
    .unique(),
  aniListId: integer("anilist_id").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const aniListUserRelations = relations(aniListUser, ({ many }) => ({
  mediaStats: many(mediaStats),
}))
