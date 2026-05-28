export const dashboardCopy = {
  en: {
    shell: {
      restricted: "Restricted access",
      medicalOnly:
        "Medical Professional track submissions only. Family / Caregiver results never populate this dashboard.",
    },
    header: {
      title: "Clinical Central Dashboard",
      subtitle:
        "Private professional view for demographic profiles, MoCA-P breakdowns, Katz ADL scores, interpretation, and assessment dates.",
      lastUpdated: "Last updated",
      totalRecords: "Total records",
    },
    kpis: {
      totalRecords: "Total Records",
      normal: "Normal",
      mci: "MCI",
      moderateDementia: "Moderate Dementia",
      severeDementia: "Severe Dementia",
      averageAdjustedMoca: "Avg. Adjusted MoCA-P",
      averageKatz: "Avg. Katz ADL",
    },
    filters: {
      title: "Filters",
      patientId: "Patient ID / Case Number",
      patientIdPlaceholder: "Search case number",
      age: "Age",
      diagnosticCategory: "Diagnostic Category",
      allCategories: "All categories",
      reset: "Reset filters",
    },
    table: {
      title: "Clinical Records",
      patientId: "Patient ID",
      name: "Name",
      age: "Age",
      sex: "Sex",
      assessmentDate: "Assessment Date",
      adjustedMoca: "Adjusted MoCA-P",
      katz: "Katz",
      diagnosticCategory: "Diagnostic Category",
      actions: "Actions",
      notProvided: "Not provided",
    },
    actions: {
      viewDetails: "View Details",
      downloadPdf: "Download PDF Report",
    },
    drawer: {
      title: "Clinical Chart Preview",
      close: "Close patient details",
      demographics: "Demographic Profile",
      scores: "Scores",
      mocaBreakdown: "MoCA-P Domain Breakdown",
      katzBreakdown: "Katz ADL Item Breakdown",
      recommendation: "Recommendation / Referral",
      clinician: "Clinician Name / ID",
      assessmentDate: "Assessment date",
      educationAdjustment: "Education adjustment",
      rawMoca: "Raw MoCA-P",
      adjustedMoca: "Adjusted MoCA-P",
      katzScore: "Katz ADL",
    },
    empty: {
      noRecordsTitle: "No medical submissions yet",
      noRecordsDescription:
        "Once trained specialists submit Medical Professional assessments, records will appear here.",
      noMatchesTitle: "No records match these filters",
      noMatchesDescription:
        "Try changing the patient ID, age range, or diagnostic category filters.",
    },
  },
  fil: {
    shell: {
      restricted: "Restricted access",
      medicalOnly:
        "Medical Professional track submissions lamang. Hindi kailanman pumapasok dito ang Family / Caregiver results.",
    },
    header: {
      title: "Clinical Central Dashboard",
      subtitle:
        "Private professional view para sa demographic profiles, MoCA-P breakdowns, Katz ADL scores, interpretation, at assessment dates.",
      lastUpdated: "Last updated",
      totalRecords: "Total records",
    },
    kpis: {
      totalRecords: "Total Records",
      normal: "Normal",
      mci: "MCI",
      moderateDementia: "Moderate Dementia",
      severeDementia: "Severe Dementia",
      averageAdjustedMoca: "Avg. Adjusted MoCA-P",
      averageKatz: "Avg. Katz ADL",
    },
    filters: {
      title: "Filters",
      patientId: "Patient ID / Case Number",
      patientIdPlaceholder: "Search case number",
      age: "Age",
      diagnosticCategory: "Diagnostic Category",
      allCategories: "All categories",
      reset: "Reset filters",
    },
    table: {
      title: "Clinical Records",
      patientId: "Patient ID",
      name: "Name",
      age: "Age",
      sex: "Sex",
      assessmentDate: "Assessment Date",
      adjustedMoca: "Adjusted MoCA-P",
      katz: "Katz",
      diagnosticCategory: "Diagnostic Category",
      actions: "Actions",
      notProvided: "Not provided",
    },
    actions: {
      viewDetails: "View Details",
      downloadPdf: "Download PDF Report",
    },
    drawer: {
      title: "Clinical Chart Preview",
      close: "Isara ang patient details",
      demographics: "Demographic Profile",
      scores: "Scores",
      mocaBreakdown: "MoCA-P Domain Breakdown",
      katzBreakdown: "Katz ADL Item Breakdown",
      recommendation: "Recommendation / Referral",
      clinician: "Clinician Name / ID",
      assessmentDate: "Assessment date",
      educationAdjustment: "Education adjustment",
      rawMoca: "Raw MoCA-P",
      adjustedMoca: "Adjusted MoCA-P",
      katzScore: "Katz ADL",
    },
    empty: {
      noRecordsTitle: "Wala pang medical submissions",
      noRecordsDescription:
        "Kapag nagsubmit ang trained specialists ng Medical Professional assessments, lalabas dito ang records.",
      noMatchesTitle: "Walang record na tugma sa filters",
      noMatchesDescription:
        "Subukan baguhin ang patient ID, age range, o diagnostic category filters.",
    },
  },
} as const;

export type DashboardCopy = (typeof dashboardCopy)[keyof typeof dashboardCopy];
