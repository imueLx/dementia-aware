import { deleteMedicalRecordById } from "@/lib/data/medical-record-repository";
import { getClinicianSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ recordId: string }> },
) {
  const { recordId } = await params;

  if (!recordId) {
    return Response.json({ error: "Missing record id" }, { status: 400 });
  }

  if (!(await getClinicianSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await deleteMedicalRecordById(recordId);

  if (!deleted) {
    return Response.json({ error: "Record not found" }, { status: 404 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
