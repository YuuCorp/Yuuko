import type { Interaction } from 'discord.js'
import type { Middleware } from '../Structures/Middleware'
import type { Client } from '../Structures/Client'

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

export interface YuukoComponent {
  name: string
  run: (interaction: Interaction, args: any, client: Client) => void
  middlewares?: Middleware[]
}

export interface Headers {
  [key: string]: string
}

export interface GraphQLResponse<TData = any> {
  data: TData
  headers: any
}
