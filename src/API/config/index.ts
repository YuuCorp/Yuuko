import { z } from "zod";

const envSchema = z.object({
  TOKEN: z.string(),
  TRUSTED_USERS: z.string().array(),
  RSS_LIMIT: z.number(),
  ANILIST_API: z.string(),
  CLIENT_ID: z.string(),
  GUILD_ID: z.string(),
  UPTIME: z.number(),
  PORT: z.number(),
  JWT_SECRET: z.string(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
