import { triggerController } from "./trigger.controller";
import { publicController } from "./public.controller";
import { infoController } from "./info.controller";
import { Elysia, t } from "elysia";
import { env } from "#env";

export const api = new Elysia({
  prefix: "/api/v1",
  name: "api:root"
})
  .guard({
    headers: t.Object({
      authorization: t.String({
        description: "Trusted User Authorization Token",
      }),
    }),
    response: {
      401: t.Object({
        message: t.String(),
      }),
    },
    detail: {
      security: [{ BearerAuth: [] }],
    },
    beforeHandle({ set, headers }) {
      if (!headers.authorization || !env().TRUSTED_USERS.includes(headers.authorization)) {
        set.status = 401;
        return { message: "Unauthorized" };
      }
    }
  },
    (app) =>
      app.use(triggerController)
        .use(infoController)
  ).use(publicController)

export type Api = typeof api;