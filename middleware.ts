import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PORTAL_FORGOT_PASSWORD,
  PORTAL_LOGIN,
  PORTAL_RESET_PASSWORD,
  SESSION_COOKIE,
} from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/jwt";

const PUBLIC_ADMIN = new Set([
  PORTAL_LOGIN.admin,
  PORTAL_FORGOT_PASSWORD.admin,
  PORTAL_RESET_PASSWORD.admin,
]);

const PUBLIC_STUDENT = new Set([
  PORTAL_LOGIN.student,
  PORTAL_FORGOT_PASSWORD.student,
  PORTAL_RESET_PASSWORD.student,
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN.has(pathname)) {
      if (session?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (session?.role !== "admin") {
      const loginUrl = new URL(PORTAL_LOGIN.admin, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/portal")) {
    if (PUBLIC_STUDENT.has(pathname)) {
      if (session?.role === "student") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
      return NextResponse.next();
    }

    if (session?.role !== "student") {
      const loginUrl = new URL(PORTAL_LOGIN.student, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/editor")) {
    if (session?.role !== "admin") {
      const loginUrl = new URL(PORTAL_LOGIN.admin, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/editor/:path*"],
};
