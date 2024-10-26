import type { Interaction } from 'discord.js'
import type { Middleware, Client } from '#structures/index'
import type { Maybe, MediaListStatus, ScoreFormat } from '#graphQL/types'

export interface Media {
  title?: {
    english: string
    romaji: string
    native: string
  }
  id?: number
  duration?: number
  episodes?: number
  chapters?: number
  volumes?: number
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'
}

export type CacheEntry = {
  notes?: Maybe<string>
  progress?: Maybe<number>
  score?: Maybe<number>
  status?: Maybe<MediaListStatus>
  user: {
    id: number,
    name: string,
    mediaListOptions?: Maybe<{
      scoreFormat?: Maybe<ScoreFormat>
    }>
  }
}

export interface YuukoComponent {
  name: string
  run: (interaction: Interaction, args: any, client: Client) => void
  middlewares?: Middleware[]
}

export type AlwaysExist<T> = T extends undefined | null ? never : T;

export interface Headers {
  [key: string]: string
}

export interface GraphQLResponse<TData = any> {
  data: TData
  headers: any
}

export type YuukoLog = {
  date: string;
  user: string;
  info: string;
}