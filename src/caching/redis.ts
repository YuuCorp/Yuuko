import { createClient } from "redis";
import { client } from "app";

export const redis = createClient({
  socket: {
    port: 6379,
    host: "localhost",
  },
});

redis.on("error", (err) => {
  console.error(err);
});

redis.on("connect", () => {
  client.log("[Redis] Connected.");
  redis.set("test", "test");
});

(async () => {
  redis.connect();
})();
