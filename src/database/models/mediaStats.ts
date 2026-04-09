import { sql, relations } from "drizzle-orm";
import { sqliteTable, integer, primaryKey, text } from "drizzle-orm/sqlite-core";
import { aniListUser } from "./anilistUser";

export const mediaStats = sqliteTable("mediastats", {
    mediaId: integer("media_id", { mode: "number" }).primaryKey(),
    type: text("type", { enum: ["ANIME", "MANGA"] }).notNull(),

    createdAt: integer("createdAt", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const mediaStatUsers = sqliteTable("mediastats_users", {
    mediaId: integer("media_id")
        .notNull()
        .references(() => mediaStats.mediaId, { onDelete: "cascade" }),

    aniListId: integer("anilist_id")
        .notNull()
        .references(() => aniListUser.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.mediaId, table.aniListId] })]);

export const mediaStatsRelations = relations(mediaStats, ({ many }) => ({
    users: many(aniListUser),
}));

export const mediaStatsUsersRelations = relations(mediaStatUsers, ({ one }) => ({
    media: one(mediaStats, {
        fields: [mediaStatUsers.mediaId],
        references: [mediaStats.mediaId],
    }),
    user: one(aniListUser, {
        fields: [mediaStatUsers.aniListId],
        references: [aniListUser.aniListId],
    })
}))
