import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Export a centralized auth middleware configured to only allow clinician role
export const auth = withAuth(
  function middleware(req) {
    // User is not authorized, redirect specifically to dashboard login page
    if (!req.nextauth.token) {
      const loginUrl = new URL("/dashboard/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // token may be undefined for unauthenticated requests
        return !!token && (token as any).role === "clinician";
      },
    },
  },
);

export default auth;
