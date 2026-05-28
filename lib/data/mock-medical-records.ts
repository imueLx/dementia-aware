import type { MedicalClinicalRecord } from "./medical-record-store";

const now = new Date();

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockMedicalRecords: MedicalClinicalRecord[] = [
  {
    recordId: "med_2026_0001",
    patientId: "CASE-2026-001",
    caseNumber: "CASE-2026-001",
    fullName: "Sample Patient",
    age: 72,
    sexAssignedAtBirth: "female",
    yearsOfFormalEducation: "7-12",
    clinicianNameOrId: "DR-SAMPLE-01",
    assessmentDate: daysAgo(1),
    moca: {
      rawTotal: 20,
      educationAdjustment: 1,
      adjustedTotal: 21,
      domainBreakdown: [
        { id: "visuospatialExecutive", title: "Visuospatial / Executive", score: 3, maxScore: 5, items: [] },
        { id: "naming", title: "Naming", score: 3, maxScore: 3, items: [] },
        { id: "attention", title: "Attention", score: 4, maxScore: 6, items: [] },
        { id: "language", title: "Language", score: 2, maxScore: 3, items: [] },
        { id: "abstraction", title: "Abstraction", score: 1, maxScore: 2, items: [] },
        { id: "delayedRecall", title: "Delayed Recall", score: 2, maxScore: 5, items: [] },
        { id: "orientation", title: "Orientation", score: 5, maxScore: 6, items: [] },
      ],
    },
    katz: {
      total: 5,
      itemBreakdown: [
        { id: "bathing", label: "Bathing", response: "independent", score: 1 },
        { id: "dressing", label: "Dressing", response: "independent", score: 1 },
        { id: "toileting", label: "Toileting", response: "independent", score: 1 },
        { id: "transferring", label: "Transferring", response: "independent", score: 1 },
        { id: "continence", label: "Continence", response: "dependent", score: 0 },
        { id: "feeding", label: "Feeding", response: "independent", score: 1 },
      ],
    },
    interpretation: {
      diagnosticCategory: "MCI",
      summary: "Flagged for possible early cognitive decline.",
      recommendation:
        "Cross-reference with functional scores and schedule follow-up.",
    },
    createdAt: daysAgo(1),
    source: "medical-professional",
  },
  {
    recordId: "med_2026_0002",
    patientId: "CASE-2026-002",
    caseNumber: "CASE-2026-002",
    fullName: "R. Santos",
    age: 66,
    sexAssignedAtBirth: "male",
    yearsOfFormalEducation: "13-16",
    clinicianNameOrId: "BHW-104",
    assessmentDate: daysAgo(4),
    moca: {
      rawTotal: 27,
      educationAdjustment: 0,
      adjustedTotal: 27,
      domainBreakdown: [
        { id: "visuospatialExecutive", title: "Visuospatial / Executive", score: 5, maxScore: 5, items: [] },
        { id: "naming", title: "Naming", score: 3, maxScore: 3, items: [] },
        { id: "attention", title: "Attention", score: 5, maxScore: 6, items: [] },
        { id: "language", title: "Language", score: 3, maxScore: 3, items: [] },
        { id: "abstraction", title: "Abstraction", score: 2, maxScore: 2, items: [] },
        { id: "delayedRecall", title: "Delayed Recall", score: 4, maxScore: 5, items: [] },
        { id: "orientation", title: "Orientation", score: 5, maxScore: 6, items: [] },
      ],
    },
    katz: {
      total: 6,
      itemBreakdown: [
        { id: "bathing", label: "Bathing", response: "independent", score: 1 },
        { id: "dressing", label: "Dressing", response: "independent", score: 1 },
        { id: "toileting", label: "Toileting", response: "independent", score: 1 },
        { id: "transferring", label: "Transferring", response: "independent", score: 1 },
        { id: "continence", label: "Continence", response: "independent", score: 1 },
        { id: "feeding", label: "Feeding", response: "independent", score: 1 },
      ],
    },
    interpretation: {
      diagnosticCategory: "Normal",
      summary: "No urgent cognitive impairment signal from this screening.",
      recommendation: "Continue routine monitoring and brain health education.",
    },
    createdAt: daysAgo(4),
    source: "medical-professional",
  },
  {
    recordId: "med_2026_0003",
    patientId: "CASE-2026-003",
    caseNumber: "CASE-2026-003",
    age: 81,
    sexAssignedAtBirth: "female",
    yearsOfFormalEducation: "0-6",
    clinicianNameOrId: "DR-ALZ-22",
    assessmentDate: daysAgo(8),
    moca: {
      rawTotal: 12,
      educationAdjustment: 1,
      adjustedTotal: 13,
      domainBreakdown: [
        { id: "visuospatialExecutive", title: "Visuospatial / Executive", score: 1, maxScore: 5, items: [] },
        { id: "naming", title: "Naming", score: 2, maxScore: 3, items: [] },
        { id: "attention", title: "Attention", score: 2, maxScore: 6, items: [] },
        { id: "language", title: "Language", score: 1, maxScore: 3, items: [] },
        { id: "abstraction", title: "Abstraction", score: 1, maxScore: 2, items: [] },
        { id: "delayedRecall", title: "Delayed Recall", score: 1, maxScore: 5, items: [] },
        { id: "orientation", title: "Orientation", score: 4, maxScore: 6, items: [] },
      ],
    },
    katz: {
      total: 3,
      itemBreakdown: [
        { id: "bathing", label: "Bathing", response: "dependent", score: 0 },
        { id: "dressing", label: "Dressing", response: "independent", score: 1 },
        { id: "toileting", label: "Toileting", response: "independent", score: 1 },
        { id: "transferring", label: "Transferring", response: "dependent", score: 0 },
        { id: "continence", label: "Continence", response: "dependent", score: 0 },
        { id: "feeding", label: "Feeding", response: "independent", score: 1 },
      ],
    },
    interpretation: {
      diagnosticCategory: "Moderate Dementia",
      summary: "Cognitive and functional scores indicate clinically significant concern.",
      recommendation:
        "Recommend comprehensive medical evaluation and caregiver support planning.",
    },
    createdAt: daysAgo(8),
    source: "medical-professional",
  },
];
