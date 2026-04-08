import { createClient } from "redis";
import { client } from "#src/app";
import { env } from "#env";

const host = env().NODE_ENV === "docker" ? "dragonfly" : "localhost";

export const redis = createClient({
  socket: {
    port: 6379,
    host,
  },
});

redis.on("error", (err) => {
  console.error(err);
});

redis.on("connect", () => {
  client.logger.info(`Connected to ${host}!`);
  redis.set("test", "test");
});

(async () => {
  redis.connect();
})();
