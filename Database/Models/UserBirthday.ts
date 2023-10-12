const { DataTypes } = require('sequelize')
const db = require('../db')

export const UserBirthday = db.define('userbirthday', {
  guild_id: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: false,
    validate: {
      len: [1, 18],
    },
  },
  user_id: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 18],
    },
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: false,
  },
})
