import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { api } from './controllers/*.js'

export async function startApi() {
  const port = process.env.PORT

  new Elysia().use(cors(/*{
    origin: /.*\.yuuko\.dev$/,
  }*/)).use(api).listen(port)

  console.log(`API is open on port ${port}`)
}
