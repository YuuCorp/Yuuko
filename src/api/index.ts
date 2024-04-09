import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { api } from './controllers/*.js'
import type { Client } from '../structures/index.js'

export async function startApi(client: Client) {
  const port = process.env.PORT

  new Elysia().use(cors({
    origin: /.*\.yuuko\.dev$/,
  })).use(api).listen(port)

  client.log(`API is open on port ${port}`)
}