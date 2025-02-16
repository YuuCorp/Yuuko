import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const botStats = sqliteTable("botstats", {
  servers: integer("servers", { mode: "number" }).notNull().default(0),
  members: integer("members", { mode: "number" }).notNull().default(0),
  registered: integer("registered", { mode: "number" }).notNull().default(0),
});