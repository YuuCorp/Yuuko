import { aniListUser } from "#models/index";
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
});

export const reminderUsers = sqliteTable("reminderusers", {
    id: integer({ mode: "number" })
        .notNull()
        .references(() => workerEvents.id, { onDelete: "cascade" }),

    aniListId: integer("anilist_id")
        .notNull()
        .references(() => aniListUser.id, { onDelete: "cascade" })
}, (table) => [primaryKey({ columns: [table.id, table.aniListId] })]);

export const workerEventsRelations = relations(workerEvents, ({ many }) => ({
    reminderUsers: many(reminderUsers),
}));

export const reminderUsersRelations = relations(reminderUsers, ({ one }) => ({
    workerEvent: one(workerEvents, {
        fields: [reminderUsers.id],
        references: [workerEvents.id],
    }),
    aniListUser: one(aniListUser, {
        fields: [reminderUsers.aniListId],
        references: [aniListUser.aniListId],
    }),
}));
