import { DataTypes } from "sequelize";
import { db } from "../db";

export const AnnouncementModel = db.define("announcement", {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: false,
  },
  announcement: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: false,
  },
});
