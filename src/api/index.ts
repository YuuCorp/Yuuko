import { api } from '#api/controllers/global.controller'
import { RSA } from '#utils/rsaEncryption';
import { cors } from '@elysiajs/cors';
import { openapi } from '@elysia/openapi';
import { Elysia } from 'elysia';
import { env } from "#env";
import { logger } from "#src/utils/logger";

export async function startApi() {
  const port = env().API_PORT;

  await RSA.loadKeys();

  new Elysia().onError(({ error }) => {
    const err = new Response(error.toString());
    logger.error(error.toString());

    return err;
  }).use(cors({
    origin: /.*\.yuuko\.dev$/,
    methods: ["POST", "GET"]
  })).use(openapi({
    documentation: {
      info: {
        title: "Yuuko API",
        version: "1.0.0",
        description: "API documentation for Yuuko services",
      },
      tags: [
        { name: "Public", description: "Unauthenticated public endpoints" },
        { name: "Protected / Info", description: "Internal status and management endpoints" }
      ],
      components: {
        securitySchemes: {
          "BearerAuth": {
            type: "apiKey",
            in: "header",
            name: "authorization",
            description: "Trusted User Token"
          }
        }
      }
    }
  })).use(api).listen(port)

  logger.info(`API is open on port ${port}`);
  logger.info(`OpenAPI UI available at http://localhost:${port}/openapi`);
}
