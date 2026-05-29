// Re-export centralized auth middleware from lib/auth
export { auth as middleware } from "@/lib/auth";

// Protect dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
