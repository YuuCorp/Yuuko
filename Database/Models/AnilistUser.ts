import type { Optional } from "sequelize";
import { DataTypes, Model } from "sequelize";

import { db } from "../db"; // assuming this is the correct path for your db instance

interface AnilistUserAttributes {
  discord_id: string;
  anilist_token: string;
  anilist_id: number;
}

interface AnilistUserCreationAttributes extends Optional<AnilistUserAttributes, "discord_id" | "anilist_token" | "anilist_id"> {}

export class AnilistUser extends Model<AnilistUserAttributes, AnilistUserCreationAttributes> implements AnilistUserAttributes {
  public discord_id!: string;
  public anilist_token!: string;
  public anilist_id!: number;
}

AnilistUser.init(
  {
    discord_id: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    anilist_token: {
      type: DataTypes.STRING(3000),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 3000],
      },
    },
    anilist_id: {
      type: DataTypes.NUMBER(),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 32],
      },
    },
  },
  {
    sequelize: db,
    tableName: "anilistuser",
  },
);