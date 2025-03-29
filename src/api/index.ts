import { api } from '#api/controllers/global.controller'
import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

export async function startApi() {
  const port = process.env.PORT

  new Elysia().use(cors({
    origin: /.*\.yuuko\.dev$/,
    methods: ["POST", "GET"],
    allowedHeaders: "Authorization"
  })).use(api).listen(port)

  console.log(`API is open on port ${port}`)
}
