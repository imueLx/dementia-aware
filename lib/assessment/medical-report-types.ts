import type {
  KatzItemId,
  KatzResponse,
  MedicalAssessmentPayload,
  MocaDomainScore,
} from "./medical-types";

export type MedicalReportPayload = MedicalAssessmentPayload;

export type MedicalReportSource = "persisted-record" | "mock-fallback";

export type ReportMetric = {
  label: string;
  value: string;
  helper?: string;
  tone?: "purple" | "green" | "amber" | "slate";
};

export type DomainBreakdownRow = {
  id: MocaDomainScore["id"];
  title: string;
  score: number;
  maxScore: number;
  percent: number;
  status: "withinExpected" | "monitor" | "concern";
};

export type KatzResultRow = {
  id: KatzItemId;
  label: string;
  response: KatzResponse;
  score: 0 | 1;
};

export type PrintReportSection = {
  title: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};
