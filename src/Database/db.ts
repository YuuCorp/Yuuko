import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import anilistUser from "./Models/AnilistUser";
import announcementModel from "./Models/Announcement";
import userBirthday from "./Models/UserBirthday";

export const tables = {
  anilistUser,
  userBirthday,
  announcementModel,
};

export const sqlite = new Database("./src/Database/db.sqlite");
export const db = drizzle(sqlite, {
  schema: tables,
});

export default db;
