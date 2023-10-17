import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import anilistUser from "./Models/AnilistUser";
import announcementModel from "./Models/Announcement";
import userBirthday from "./Models/UserBirthday";

export const tables = {
  anilistUser,
  userBirthday,
  announcementModel,
};

export const sqlite = new Database("./src/Database/db.sqlite");
export const db: BetterSQLite3Database<typeof tables> = drizzle(sqlite, {
  schema: tables,
});

export default db;
