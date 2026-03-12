import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.UPSTASH_REDIS_URL) {
  console.error("❌ UPSTASH_REDIS_URL is missing");
}

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {},   // required for Upstash
});

redis.on("connect", () => {
  console.log("✅ Connected to Upstash Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;
