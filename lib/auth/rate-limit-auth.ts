import {
  AUTH_RATE_LIMITS,
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/lib/auth/rate-limit";

type AuthRateLimitAction = keyof typeof AUTH_RATE_LIMITS;

export function enforceAuthRateLimit(request: Request, action: AuthRateLimitAction) {
  const ip = getRequestIp(request);
  const config = AUTH_RATE_LIMITS[action];
  const result = checkRateLimit({
    key: `${action}:${ip}`,
    limit: config.limit,
    windowMs: config.windowMs,
  });

  if (!result.allowed) {
    return rateLimitResponse(result.retryAfterSec);
  }

  return null;
}
