const { Sequelize, Model, DataTypes } = require("sequelize");
const db = require("../db");

const UserBirthday = db.define("userbirthday", {
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
        unique: true,
    },
});

// (async () => {
//   await sequelize.sync({ force: true });
// })();

module.exports = UserBirthday;
