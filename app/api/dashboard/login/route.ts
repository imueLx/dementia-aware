import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token ?? "");
  const expected = process.env.CLINICAL_DASHBOARD_TOKEN ?? "";

  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "Server not configured." },
      { status: 500 },
    );
  }

  if (token !== expected) {
    return NextResponse.json(
      { ok: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  const res = NextResponse.redirect(new URL("/dashboard", request.url));
  // set cookie for 7 days
  res.cookies.set("clinical_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
