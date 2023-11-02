export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string
      TRUSTED_USERS: string[]
      PREFIX: string
      RSS_LIMIT: number
      ANILIST_API: string
      CLIENT_ID: string
      GUILD_ID: string
      UPTIME: number
      UPSTASH_REDIS_REST_URL: string // currently not optional, but planned in the future
      UPSTASH_REDIS_REST_TOKEN: string // currently not optinal, but planned in the future
    }
  }
}
