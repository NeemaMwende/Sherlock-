import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Logged-in users can proceed
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
