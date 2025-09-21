import { createClient } from "redis";
import { client } from "app";
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
  client.log(`Connected to ${host}!`, "info");
  redis.set("test", "test");
});

(async () => {
  redis.connect();
})();
