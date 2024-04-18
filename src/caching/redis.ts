import { createClient } from "redis";
import { client } from "app";

const host = process.env.NODE_ENV === "docker" ? "dragonfly" : "localhost";

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
  client.log(`[Redis] Connected to ${host}!`);
  redis.set("test", "test");
});

(async () => {
  redis.connect();
})();
