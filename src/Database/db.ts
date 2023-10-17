import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import anilistUser from "./Models/AnilistUser";
import userBirthday from "./Models/UserBirthday";
import announcementModel from "./Models/Announcement";

export const tables = {
  anilistUser,
  userBirthday,
  announcementModel,
};

export const sqlite = new Database("./Database/db.sqlite");
export const db: BunSQLiteDatabase<typeof tables> = drizzle(sqlite, {
  schema: tables,
});

export default db;
