import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userBirthday = sqliteTable("userbirthday", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  guildId: text("guild_id", {
    length: 18,
  }).notNull(),
  userId: text("user_id", {
    length: 18,
  }).notNull(),
  birthday: text("birthday")
  .notNull(),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`),
});

export default userBirthday
