import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import { anilistUser, announcementModel, userBirthday, AnimeStats, MangaStats, BotStats } from "#models/index";

export const tables = {
  anilistUser,
  userBirthday,
  announcementModel,
};

export const statTables = {
  AnimeStats,
  MangaStats,
  BotStats,
};

export const sqlite = new Database("./src/database/db.sqlite");
export const statDB = new Database("./src/database/statsdb.sqlite");
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite, {
  schema: tables,
});

export const stat = drizzle(statDB, {
  schema: statTables,
});

export type StatUser = {
  aId: number;
  dId: string;
};

export default { db, stat };
