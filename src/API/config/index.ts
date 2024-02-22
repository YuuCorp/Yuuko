import {z} from "zod"

const envSchema = z.object({
  TOKEN: z.string(),
  TRUSTED_USERS: z.string().array(),
  PREFIX: z.string(),
  RSS_LIMIT: z.number(),
  ANILIST_API: z.string(),
  CLIENT_ID: z.string(),
  GUILD_ID: z.string(),
  UPTIME: z.number(),
  PORT: z.number()
})

export const env = envSchema.parse(process.env)  

export const config = {
  env
}