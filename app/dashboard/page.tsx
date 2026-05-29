import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { listMedicalRecords } from "@/lib/data/medical-record-repository";
import { transformRecordToDashboardRecord } from "@/lib/assessment/medical-transformers";
import { redirect } from "next/navigation";
import { getClinicianSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await getClinicianSession())) {
    redirect("/dashboard/login");
  }

  const records = await listMedicalRecords();
  const dashboardRecords = records.map(transformRecordToDashboardRecord);

  return <DashboardShell initialRecords={dashboardRecords} />;
}
