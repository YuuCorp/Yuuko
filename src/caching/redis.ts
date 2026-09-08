import { createClient } from "redis";
import { env } from "#env";
import { logger } from "#src/utils/logger";
import { handleAsync } from "#src/utils";

const host = env.NODE_ENV === "docker" ? "dragonfly" : "localhost";

export const redis = createClient({
  socket: {
    port: 6379,
    host,
  },
});

redis.on("error", (err) => {
  logger.error(err);
});

redis.on("connect", handleAsync(async () => {
  logger.info(`Connected to ${host}!`);
  await redis.set("test", "test");
}));

handleAsync((async () => {
  await redis.connect();
}))();
