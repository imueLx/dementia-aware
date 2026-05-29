import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { listMedicalRecords } from "@/lib/data/medical-record-repository";
import { transformRecordToDashboardRecord } from "@/lib/assessment/medical-transformers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session.user as any)?.role !== "clinician") {
    redirect("/dashboard/login");
  }

  const records = await listMedicalRecords();
  const dashboardRecords = records.map(transformRecordToDashboardRecord);

  return <DashboardShell initialRecords={dashboardRecords} />;
}
