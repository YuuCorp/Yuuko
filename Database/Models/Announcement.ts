import { Model } from "sequelize";

const { DataTypes } = require("sequelize");
const db = require("../db");

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
