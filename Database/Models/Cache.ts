const { DataTypes } = require("sequelize");
const db = require("../db");

export const CacheModel = db.define("cache", {
  type: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
  },
  cacheID: {
    type: DataTypes.STRING(),
    allowNull: false,
    unique: true,
  },
  keywords: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
  data: {
    type: DataTypes.TEXT(),
    allowNull: false,
  },
}) as Cache;
