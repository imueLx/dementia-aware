import { NextResponse } from "next/server";
import { listMedicalRecords } from "@/lib/data/medical-record-repository";

export async function GET() {
  if (String(process.env.ENABLE_DEV_ROUTES ?? "false") !== "true") {
    return new Response(null, { status: 404 });
  }
  // Require authenticated clinician session for dev routes as well
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth/options");
  const session = await getServerSession(authOptions as any);
  if (!session || (session.user as any)?.role !== "clinician") {
    return new Response(null, { status: 401 });
  }
  try {
    const records = await listMedicalRecords();
    return NextResponse.json({ ok: true, count: records.length, records });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
