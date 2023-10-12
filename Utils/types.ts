import { Model, DataTypes } from "sequelize";
import { Middleware } from "../Structures/Middleware";
import { Client } from "../Structures/Client";
import { Interaction } from "discord.js";

export type Media = {
  title?: {
    english: string;
    romaji: string;
    native: string;
  };
  id?: number;
  duration?: number;
  episodes?: number;
  chapters?: number;
  volumes?: number;
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
};

export type YuukoComponent = {
  name: string;
  run: (interaction: Interaction, args: any, client: Client) => void;
  middlewares?: Middleware[];
};

export type Announcement = Model & {
  date: Date;
  announcement: string;
};

export type Cache = Model & {
  type: string;
  cacheID: string;
  keywords: string;
  data: string;
};

export type UserBirthday = Model & {
  guild_id: string;
  user_id: string;
  birthday: Date;
};

export type Headers = {
  [key: string]: string;
};

export type GraphQLResponse = {
  data: any;
  headers: Headers;
};
