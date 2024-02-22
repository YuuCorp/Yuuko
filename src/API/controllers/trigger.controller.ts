import { Elysia, t } from "elysia";

export const triggerController = new Elysia({
  prefix: "/trigger",
  name: "api:admin",
})
  .post("/restart", async () => {
    return {};
  })
  .post("/update", async () => {
    return {};
  })
  .post("/wipe-logs", async () => {
    return {};
  });
