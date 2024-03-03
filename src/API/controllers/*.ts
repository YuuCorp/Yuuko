import { triggerController } from "./trigger.controller";
import { infoController } from "./info.controller";
import { Elysia } from "elysia";

export const api = new Elysia({
  prefix: "/api/v1",
  name: "api:root"
})
  .use(triggerController)
  .use(infoController)