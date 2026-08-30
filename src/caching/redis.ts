import { createClient } from "redis";
import { env } from "#env";
import { logger } from "#src/utils/logger";

const host = env().NODE_ENV === "docker" ? "dragonfly" : "localhost";

export const redis = createClient({
  socket: {
    port: 6379,
    host,
  },
});

redis.on("error", (err) => {
  logger.error(err);
});

redis.on("connect", () => {
  logger.info(`Connected to ${host}!`);
  redis.set("test", "test");
});

(async () => {
  redis.connect();
})();
