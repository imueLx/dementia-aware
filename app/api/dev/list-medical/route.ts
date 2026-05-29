import { NextResponse } from "next/server";
import { listMedicalRecords } from "@/lib/data/medical-record-repository";

export async function GET() {
  if (String(process.env.ENABLE_DEV_ROUTES ?? "false") !== "true") {
    return new Response(null, { status: 404 });
  }
  const { getClinicianSession } = await import("@/lib/auth/session");
  if (!(await getClinicianSession())) {
    return new Response(null, { status: 401 });
  }
  try {
    const records = await listMedicalRecords();
    return NextResponse.json({ ok: true, count: records.length, records });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
