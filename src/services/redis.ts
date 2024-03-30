import { createClient } from "redis";

const url = process.env.REDIS_URL ?? "redis://localhost:6379";

const redisClient = createClient({ url });

redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("error", (error: unknown) =>
  console.log("Redis client error", error),
);

redisClient.connect();

export default redisClient;
