import { api } from '#api/controllers/global.controller'
import { RSA } from '#utils/rsaEncryption';
import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { env } from "#env";

export async function startApi() {
  const port = env().API_PORT;
  const isDev = env().NODE_ENV !== "production";

  await RSA.loadKeys();

  const app = new Elysia().onError(({ error }) => {
    console.error(error);
    return new Response(error.toString(), { status: 500 });
  });

  if (!isDev) {
    app.use(cors({
      origin: /.*\.yuuko\.dev$/,
      methods: ["POST", "GET"]
    }));
  }

  app.use(api).listen(port);

  console.log(`API is open on port ${port}`)
}
