import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../redis/redis";

export const loginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl_login",
  points: 5, // 5 attempts
  duration: 60, // per 60 seconds
  blockDuration: 300, // block 5 minutes after exceeded
});

export const signupLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "signup",
  points: 5, // 5 attempts
  duration: 15 * 60, // per 15 minutes
});
