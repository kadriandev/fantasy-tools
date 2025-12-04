import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshYahooTokens } from "./lib/yahoo/refresh-token";

const publicRoutes = ["/", "/api"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const res = NextResponse.next();

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((r) => pathname === r);
  if (isPublicRoute) return NextResponse.next();

  const access = request.cookies.get("yahoo_access_token");
  const refresh = request.cookies.get("yahoo_refresh_token");
  let access_token = access?.value;

  if (!refresh) return NextResponse.redirect(`${origin}/`);

  if (!access_token) {
    const tokens = await refreshYahooTokens(refresh.value);
    res.cookies.set({
      name: "yahoo_access_token",
      value: tokens.access_token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });

    res.cookies.set({
      name: "yahoo_refresh_token",
      value: tokens.refresh_token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 34560000,
    });
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
