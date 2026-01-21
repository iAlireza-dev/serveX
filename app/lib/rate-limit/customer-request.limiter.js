import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "./redis";

export const createRequestLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "request:create",
  points: 3, // 3 request
  duration: 60, // per minute
});

export const updateRequestLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "request:update",
  points: 10, // 10 requests
  duration: 60, // per minute
});
