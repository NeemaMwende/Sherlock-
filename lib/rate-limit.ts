import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// a new ratelimiter, that allows 5 requests per 10 minute
const redis = Redis.fromEnv();

export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
});
