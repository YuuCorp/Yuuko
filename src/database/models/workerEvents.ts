import { anilistUser } from "#models/index";
import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workerEvents = sqliteTable("workerevents", {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

    period: integer().notNull(),
    type: text({ enum: ["REMINDER", "SYNC"] }).notNull(),
    animeId: integer("anime_id")
        .default(-1),

    createdAt: integer("createdAt", { mode: "timestamp" })
        .notNull()
        .default(sql`current_timestamp`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`current_timestamp`)
        .$onUpdateFn(() => sql`current_timestamp`),
});

export const reminderUsers = sqliteTable("reminderusers", {
    id: integer({ mode: "number" })
        .notNull()
        .references(() => workerEvents.id, { onDelete: "cascade" }),

    anilistId: integer("anilist_id")
        .notNull()
        .references(() => anilistUser.id, { onDelete: "cascade" })
}, (table) => [primaryKey({ columns: [table.id, table.anilistId] })]);

export const workerEventsRelations = relations(workerEvents, ({ many }) => ({
    reminderUsers: many(reminderUsers),
}));

export const reminderUsersRelations = relations(reminderUsers, ({ one }) => ({
    workerEvent: one(workerEvents, {
        fields: [reminderUsers.id],
        references: [workerEvents.id],
    }),
    anilistUser: one(anilistUser, {
        fields: [reminderUsers.anilistId],
        references: [anilistUser.anilistId],
    }),
}));