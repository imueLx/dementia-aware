import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const signOutUrl = new URL("/api/auth/signout", request.url);
  signOutUrl.searchParams.set("callbackUrl", new URL("/", request.url).toString());
  return NextResponse.redirect(signOutUrl);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
