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
    }
  }
}
