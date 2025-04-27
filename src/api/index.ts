import { api } from '#api/controllers/global.controller'
import { RSA } from '#utils/rsaEncryption';
import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { env } from "#env";

export async function startApi() {
  const port = env().API_PORT;
  const rsa = new RSA();
  await rsa.loadKeys();

  new Elysia().onError(({ error }) => {
    const err = new Response(error.toString());
    console.error(err);

    return err;
  }).use(cors({
    origin: /.*\.yuuko\.dev$/,
    methods: ["POST", "GET"]
  })).use(api).listen(port)

  console.log(`API is open on port ${port}`)
}
