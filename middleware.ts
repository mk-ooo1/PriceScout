import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // any logged-in admin/editor
    },
    pages: { signIn: "/admin/login" },
  }
);

// Exclude /admin/login itself, or a logged-out visit becomes a redirect loop.
export const config = {
  matcher: ["/admin/((?!login).*)", "/api/admin/:path*"],
};
