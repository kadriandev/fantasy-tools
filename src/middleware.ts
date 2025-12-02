import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/api"];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Skip if session_expired param is already present to avoid redirect loops
  if (searchParams.get("session_expired") === "true") {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((r) => pathname === r);
  if (!isPublicRoute) {
    const yahooAccessToken = request.cookies.get("yahoo_access_token");
    // If Yahoo access token is missing, redirect with session_expired param
    if (!yahooAccessToken) {
      const url = request.nextUrl.clone();
      url.searchParams.set("session_expired", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
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
