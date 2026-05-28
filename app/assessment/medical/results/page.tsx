import { MedicalResultsView } from "@/components/assessment/medical/results-view";
import { transformRecordToMedicalPayload } from "@/lib/assessment/medical-transformers";
import { getMedicalRecordById } from "@/lib/data/medical-record-repository";

export const dynamic = "force-dynamic";

type MedicalResultsPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function MedicalResultsPage({
  searchParams,
}: MedicalResultsPageProps) {
  const { id } = await searchParams;
  const record = id ? await getMedicalRecordById(id) : null;
  const report = record ? transformRecordToMedicalPayload(record) : null;

  return (
    <MedicalResultsView
      report={report}
      source={record ? "persisted-record" : "mock-fallback"}
    />
  );
}
