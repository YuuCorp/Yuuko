const { Sequelize, Model, DataTypes } = require("sequelize");
const db = require("../db");

const AnnouncementModel = db.define("announcement", {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false,
    },
    announcement: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: false,
    }
});

// (async () => {
//   await sequelize.sync({ force: true });
// })();

module.exports = AnnouncementModel;