import { anilistUser } from "#models/index";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workerEvents = sqliteTable("workerevents", {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

    period: integer().notNull(),
    type: text({ enum: ["REMINDER", "SYNC"] }).notNull(),

    createdAt: integer("createdAt", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

export const reminderUsers = sqliteTable("reminderusers", {
    id: integer({ mode: "number" })
        .notNull()
        .references(() => workerEvents.id, { onDelete: "cascade" }),

    anilistId: integer("anilist_id")
        .notNull()
        .references(() => anilistUser.id, { onDelete: "cascade" })
});