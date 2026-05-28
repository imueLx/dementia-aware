import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { listMedicalRecords } from "@/lib/data/medical-record-repository";
import { transformRecordToDashboardRecord } from "@/lib/assessment/medical-transformers";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const records = await listMedicalRecords();
  const dashboardRecords = records.map(transformRecordToDashboardRecord);

  return <DashboardShell initialRecords={dashboardRecords} />;
}
