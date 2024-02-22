import { Elysia } from "elysia";
import { triggerController } from "./trigger.controller";
import { infoController } from "./info.controller";

export const api = new Elysia({
  prefix: "/api/v1",
  name: "api:root"
}).use(triggerController).use(infoController)