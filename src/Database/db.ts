import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import anilistUser from "./Models/AnilistUser";
import announcementModel from "./Models/Announcement";
import userBirthday from "./Models/UserBirthday";

import AnimeStats from "./Models/AnimeStats";
import MangaStats from "./Models/MangaStats";
import BotStats from "./Models/BotStats";

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

export const sqlite = new Database("./src/Database/db.sqlite");
export const statDB = new Database("./src/Database/statsdb.sqlite");
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
