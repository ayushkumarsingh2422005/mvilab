export const SESSION_COOKIE = "mvilab_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const RESET_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
export const WELCOME_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type AuthPortal = "admin" | "student";

export const PORTAL_HOME: Record<AuthPortal, string> = {
  admin: "/admin",
  student: "/portal",
};

export const PORTAL_LOGIN: Record<AuthPortal, string> = {
  admin: "/admin/login",
  student: "/portal/login",
};

export const PORTAL_FORGOT_PASSWORD: Record<AuthPortal, string> = {
  admin: "/admin/forgot-password",
  student: "/portal/forgot-password",
};

export const PORTAL_RESET_PASSWORD: Record<AuthPortal, string> = {
  admin: "/admin/reset-password",
  student: "/portal/reset-password",
};
