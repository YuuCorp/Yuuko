import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";

import { db } from "../db"; // assuming this is the correct path for your db instance

interface UserBirthdayAttributes {
  guild_id: string;
  user_id: string;
  birthday: Date;
}

interface UserBirthdayCreationAttributes extends Optional<UserBirthdayAttributes, "guild_id" | "user_id" | "birthday"> {}

export class UserBirthday extends Model<UserBirthdayAttributes, UserBirthdayCreationAttributes> implements UserBirthdayAttributes {
  public guild_id!: string;
  public user_id!: string;
  public birthday!: Date;
}

UserBirthday.init(
  {
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
  },
  {
    sequelize: db,
    tableName: "userbirthday",
  },
);