import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFDocument as PDFDocumentType, PDFFont, PDFPage, RGB } from "pdf-lib";
import type {
  DomainBreakdownRow,
  KatzResultRow,
  MedicalReportPayload,
  PrintReportSection,
} from "./medical-report-types";
import { formatAssessmentDateWithLocale } from "./medical-report-utils";

const PAGE_SIZE: [number, number] = [595.28, 841.89];
const PAGE_W = PAGE_SIZE[0];
const PAGE_H = PAGE_SIZE[1];
const MARGIN = 48;
const FOOTER_H = 32;
const CONTENT_W = PAGE_W - MARGIN * 2;

const COLORS = {
  purple: rgb(0.357, 0.294, 0.478),
  purpleDark: rgb(0.28, 0.22, 0.38),
  purpleLight: rgb(0.93, 0.91, 0.97),
  purpleLine: rgb(0.82, 0.78, 0.9),
  text: rgb(0.11, 0.13, 0.16),
  textMuted: rgb(0.42, 0.45, 0.5),
  textLight: rgb(0.55, 0.58, 0.62),
  border: rgb(0.86, 0.88, 0.91),
  surface: rgb(0.97, 0.97, 0.99),
  surfaceAlt: rgb(0.95, 0.95, 0.97),
  white: rgb(1, 1, 1),
} as const;

export type MedicalPdfDocumentInput = {
  recordId: string;
  report: MedicalReportPayload;
  sections: PrintReportSection[];
  domains: DomainBreakdownRow[];
  katzRows: KatzResultRow[];
  rationale: string;
  recommendation: string;
};

type Fonts = {
  regular: PDFFont;
  bold: PDFFont;
};

type TableColumn = {
  header: string;
  width: number;
  align?: "left" | "center" | "right";
};

/** Helvetica StandardFonts only support WinAnsi; normalize common Unicode. */
export function sanitizePdfText(value: string): string {
  return String(value ?? "")
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ");
}

function domainStatusLabel(status: DomainBreakdownRow["status"]): string {
  if (status === "withinExpected") return "Within expected";
  if (status === "monitor") return "Monitor";
  return "Concern";
}

function katzStatusLabel(response: KatzResultRow["response"]): string {
  return response === "independent" ? "Independent" : "Dependent";
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const safe = sanitizePdfText(text);
  const words = safe.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = words[0];

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  lines.push(current);
  return lines;
}

class MedicalPdfWriter {
  private readonly pdfDoc: PDFDocumentType;
  private readonly fonts: Fonts;
  private page: PDFPage;
  private y: number;
  private readonly pages: PDFPage[] = [];

  constructor(pdfDoc: PDFDocumentType, fonts: Fonts) {
    this.pdfDoc = pdfDoc;
    this.fonts = fonts;
    this.page = pdfDoc.addPage(PAGE_SIZE);
    this.pages.push(this.page);
    this.y = PAGE_H - MARGIN;
  }

  async save(): Promise<Uint8Array> {
    this.drawFooters();
    return this.pdfDoc.save();
  }

  private newPage(): void {
    this.page = this.pdfDoc.addPage(PAGE_SIZE);
    this.pages.push(this.page);
    this.y = PAGE_H - MARGIN;
    this.drawContinuationHeader();
  }

  private bottomLimit(): number {
    return MARGIN + FOOTER_H;
  }

  private ensureSpace(height: number): void {
    if (this.y - height < this.bottomLimit()) {
      this.newPage();
    }
  }

  private drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options: { fill?: RGB; border?: RGB; borderWidth?: number },
  ): void {
    if (options.fill) {
      this.page.drawRectangle({ x, y, width: w, height: h, color: options.fill });
    }
    if (options.border) {
      this.page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: options.border,
        borderWidth: options.borderWidth ?? 0.75,
      });
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, color = COLORS.border): void {
    this.page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 0.75,
      color,
    });
  }

  private drawText(
    text: string,
    x: number,
    baselineY: number,
    size: number,
    font: PDFFont,
    color = COLORS.text,
  ): void {
    this.page.drawText(sanitizePdfText(text), {
      x,
      y: baselineY,
      size,
      font,
      color,
    });
  }

  private measureText(text: string, size: number, font: PDFFont): number {
    return font.widthOfTextAtSize(sanitizePdfText(text), size);
  }

  private advance(amount: number): void {
    this.y -= amount;
  }

  private drawSectionHeading(title: string): void {
    this.ensureSpace(28);
    this.drawText(title.toUpperCase(), MARGIN, this.y - 11, 9, this.fonts.bold, COLORS.purple);
    this.advance(14);
    this.drawLine(MARGIN, this.y, PAGE_W - MARGIN, this.y, COLORS.purpleLine);
    this.advance(12);
  }

  private drawContinuationHeader(): void {
    this.drawRect(MARGIN, this.y - 2, CONTENT_W, 22, { fill: COLORS.surface });
    this.drawText(
      "DementiAware - Medical Cognitive Assessment Report (continued)",
      MARGIN + 10,
      this.y - 14,
      8,
      this.fonts.bold,
      COLORS.textMuted,
    );
    this.advance(28);
  }

  private drawFooters(): void {
    const total = this.pages.length;
    this.pages.forEach((page, index) => {
      const footerY = MARGIN - 6;
      page.drawLine({
        start: { x: MARGIN, y: footerY + 14 },
        end: { x: PAGE_W - MARGIN, y: footerY + 14 },
        thickness: 0.5,
        color: COLORS.border,
      });
      page.drawText(sanitizePdfText("DementiAware  |  Confidential clinical report"), {
        x: MARGIN,
        y: footerY,
        size: 7.5,
        font: this.fonts.regular,
        color: COLORS.textLight,
      });
      page.drawText(sanitizePdfText(`Page ${index + 1} of ${total}`), {
        x: PAGE_W - MARGIN - this.measureText(`Page ${index + 1} of ${total}`, 7.5, this.fonts.regular),
        y: footerY,
        size: 7.5,
        font: this.fonts.regular,
        color: COLORS.textLight,
      });
    });
  }

  private drawReportHeader(input: MedicalPdfDocumentInput): void {
    const { recordId, report, sections } = input;
    const demographics = sections[0]?.rows ?? [];
    const assessmentDate =
      demographics.find((r) => r.label === "Assessment date")?.value ??
      formatAssessmentDateWithLocale(report.assessmentDate, "en");
    const clinician =
      demographics.find((r) => r.label === "Clinician")?.value ??
      report.clinicianIdentifier;
    const patientId =
      demographics.find((r) => r.label === "Patient ID")?.value ??
      report.demographics.patientId;

    this.drawRect(MARGIN, PAGE_H - MARGIN - 4, CONTENT_W, 4, { fill: COLORS.purple });

    let cursorY = PAGE_H - MARGIN - 22;
    this.drawText("DementiAware", MARGIN, cursorY, 22, this.fonts.bold, COLORS.purple);
    cursorY -= 28;
    this.drawText(
      "Medical Cognitive Assessment Report",
      MARGIN,
      cursorY,
      14,
      this.fonts.bold,
      COLORS.text,
    );
    cursorY -= 18;
    this.drawText(
      "Structured MoCA-P and Katz ADL clinical summary",
      MARGIN,
      cursorY,
      9,
      this.fonts.regular,
      COLORS.textMuted,
    );

    const metaTop = cursorY - 28;
    const metaH = 52;
    this.drawRect(MARGIN, metaTop - metaH, CONTENT_W, metaH, {
      fill: COLORS.surface,
      border: COLORS.border,
    });

    const colW = CONTENT_W / 2 - 16;
    const leftX = MARGIN + 12;
    const rightX = MARGIN + CONTENT_W / 2 + 4;
    const row1Y = metaTop - 18;
    const row2Y = metaTop - 36;

    const metaPairs: Array<[string, string, number]> = [
      ["Record ID", recordId, leftX],
      ["Patient ID", patientId, rightX],
      ["Assessment date", assessmentDate, leftX],
      ["Clinician", clinician || "Not provided", rightX],
    ];

    this.drawText(metaPairs[0][0], metaPairs[0][2], row1Y + 10, 7.5, this.fonts.regular, COLORS.textMuted);
    this.drawText(metaPairs[0][1], metaPairs[0][2], row1Y, 9.5, this.fonts.bold, COLORS.text);
    this.drawText(metaPairs[1][0], metaPairs[1][2], row1Y + 10, 7.5, this.fonts.regular, COLORS.textMuted);
    this.drawText(
      metaPairs[1][1],
      metaPairs[1][2],
      row1Y,
      9.5,
      this.fonts.bold,
      COLORS.text,
    );

    this.drawText(metaPairs[2][0], metaPairs[2][2], row2Y + 10, 7.5, this.fonts.regular, COLORS.textMuted);
    this.drawText(
      metaPairs[2][1].length > colW / 5 ? metaPairs[2][1].slice(0, 40) : metaPairs[2][1],
      metaPairs[2][2],
      row2Y,
      9.5,
      this.fonts.regular,
      COLORS.text,
    );
    this.drawText(metaPairs[3][0], metaPairs[3][2], row2Y + 10, 7.5, this.fonts.regular, COLORS.textMuted);
    this.drawText(metaPairs[3][1], metaPairs[3][2], row2Y, 9.5, this.fonts.regular, COLORS.text);

    this.y = metaTop - metaH - 20;
  }

  private drawKeyValueGrid(
    pairs: Array<{ label: string; value: string }>,
    columns = 2,
  ): void {
    const colW = CONTENT_W / columns;
    const rowH = 30;
    const rows = Math.ceil(pairs.length / columns);
    const boxH = rows * rowH + 16;

    this.ensureSpace(boxH + 8);
    const boxY = this.y - boxH;
    this.drawRect(MARGIN, boxY, CONTENT_W, boxH, {
      fill: COLORS.surface,
      border: COLORS.border,
    });

    pairs.forEach((pair, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = MARGIN + 12 + col * colW;
      const baseline = boxY + boxH - 14 - row * rowH;
      this.drawText(pair.label, x, baseline + 11, 7.5, this.fonts.regular, COLORS.textMuted);
      this.drawText(pair.value, x, baseline, 10, this.fonts.bold, COLORS.text);
    });

    this.y = boxY - 16;
  }

  private drawScoreSummary(input: MedicalPdfDocumentInput): void {
    const { report, recommendation } = input;
    const referral =
      report.referralAction ||
      report.interpretation.referralAction ||
      recommendation;

    const cardH = 88;
    const gap = 10;
    const cardW = (CONTENT_W - gap) / 2;

    this.ensureSpace(cardH + 12);

    const topY = this.y;
    const drawScoreCard = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      value: string,
      sub: string,
      accent: boolean,
    ) => {
      this.drawRect(x, y - h, w, h, {
        fill: accent ? COLORS.purpleLight : COLORS.white,
        border: accent ? COLORS.purpleLine : COLORS.border,
      });
      this.drawText(label, x + 12, y - 18, 8, this.fonts.bold, COLORS.textMuted);
      this.drawText(value, x + 12, y - 46, 22, this.fonts.bold, accent ? COLORS.purple : COLORS.text);
      this.drawText(sub, x + 12, y - 62, 8, this.fonts.regular, COLORS.textMuted);
    };

    const row1Bottom = topY;
    drawScoreCard(
      MARGIN,
      row1Bottom,
      cardW,
      cardH,
      "Final Adjusted MoCA-P",
      `${report.moca.adjustedTotal}`,
      `out of 30  |  Raw ${report.moca.rawTotal}  |  Edu adj +${report.moca.educationAdjustment}`,
      true,
    );
    drawScoreCard(
      MARGIN + cardW + gap,
      row1Bottom,
      cardW,
      cardH,
      "Katz ADL Total",
      `${report.katz.total}`,
      "out of 6 functional independence items",
      true,
    );

    this.y = topY - cardH - gap;

    const tallCardH = 72;
    this.ensureSpace(tallCardH + 8);
    const row2Bottom = this.y;

    this.drawRect(MARGIN, row2Bottom - tallCardH, CONTENT_W, tallCardH, {
      fill: COLORS.white,
      border: COLORS.border,
    });

    const half = CONTENT_W / 2;
    this.drawLine(MARGIN + half, row2Bottom - tallCardH, MARGIN + half, row2Bottom, COLORS.border);

    this.drawText("Clinical interpretation", MARGIN + 12, row2Bottom - 18, 8, this.fonts.bold, COLORS.textMuted);
    this.drawText(
      report.interpretation.matrixInterpretation,
      MARGIN + 12,
      row2Bottom - 40,
      11,
      this.fonts.bold,
      COLORS.purpleDark,
    );

    this.drawText(
      "Recommended action / referral",
      MARGIN + half + 12,
      row2Bottom - 18,
      8,
      this.fonts.bold,
      COLORS.textMuted,
    );
    const referralLines = wrapText(referral, this.fonts.regular, 9, half - 24);
    referralLines.slice(0, 3).forEach((line, i) => {
      this.drawText(line, MARGIN + half + 12, row2Bottom - 34 - i * 11, 9, this.fonts.regular, COLORS.text);
    });

    this.y = row2Bottom - tallCardH - 20;
  }

  private drawTableHeader(
    columns: TableColumn[],
    tableX: number,
    tableW: number,
    tableTop: number,
    headerH: number,
    headerFill?: RGB,
  ): void {
    this.drawRect(tableX, tableTop - headerH, tableW, headerH, {
      fill: headerFill ?? COLORS.purpleLight,
      border: COLORS.border,
    });

    let colX = tableX;
    columns.forEach((col) => {
      this.drawText(col.header, colX + 8, tableTop - 16, 8, this.fonts.bold, COLORS.purpleDark);
      colX += col.width;
    });
  }

  private drawTableRow(
    columns: TableColumn[],
    row: string[],
    tableX: number,
    tableW: number,
    rowTop: number,
    rowHeight: number,
    rowIndex: number,
  ): void {
    const fill = rowIndex % 2 === 1 ? COLORS.surfaceAlt : COLORS.white;
    this.drawRect(tableX, rowTop - rowHeight, tableW, rowHeight, {
      fill,
      border: COLORS.border,
    });

    let colX = tableX;
    row.forEach((cell, cellIndex) => {
      const col = columns[cellIndex];
      const size = 9;
      const text = sanitizePdfText(cell);
      let textX = colX + 8;
      if (col.align === "center") {
        textX = colX + (col.width - this.measureText(text, size, this.fonts.regular)) / 2;
      } else if (col.align === "right") {
        textX = colX + col.width - 8 - this.measureText(text, size, this.fonts.regular);
      }
      const font = this.fonts.regular;
      this.drawText(text, textX, rowTop - 14, size, font, COLORS.text);
      colX += col.width;
    });
  }

  private drawTable(
    columns: TableColumn[],
    rows: string[][],
    options?: { rowHeight?: number; headerFill?: RGB },
  ): void {
    const rowHeight = options?.rowHeight ?? 22;
    const headerH = 24;
    const tableW = columns.reduce((sum, col) => sum + col.width, 0);
    const tableX = MARGIN;

    let tableTop = this.y;
    let rowCounter = 0;

    const startTableSection = () => {
      this.ensureSpace(headerH + rowHeight + 8);
      tableTop = this.y;
      this.drawTableHeader(columns, tableX, tableW, tableTop, headerH, options?.headerFill);
      tableTop -= headerH;
    };

    startTableSection();

    rows.forEach((row) => {
      if (tableTop - rowHeight < this.bottomLimit()) {
        this.y = tableTop - 8;
        startTableSection();
      }

      this.drawTableRow(columns, row, tableX, tableW, tableTop, rowHeight, rowCounter);
      tableTop -= rowHeight;
      rowCounter += 1;
    });

    this.y = tableTop - 16;
  }

  private drawClinicalNotes(
    interpretation: string,
    rationale: string,
    recommendation: string,
    referralAction: string,
  ): void {
    this.drawSectionHeading("Clinical Notes & Interpretation");

    const boxPad = 14;
    const innerW = CONTENT_W - boxPad * 2;

    this.drawText("Classification", MARGIN, this.y - 10, 8, this.fonts.bold, COLORS.textMuted);
    this.advance(14);
    this.drawRect(MARGIN, this.y - 26, CONTENT_W, 26, {
      fill: COLORS.purpleLight,
      border: COLORS.purpleLine,
    });
    this.drawText(interpretation, MARGIN + 12, this.y - 18, 12, this.fonts.bold, COLORS.purpleDark);
    this.advance(36);

    const blocks: Array<{ title: string; body: string }> = [
      { title: "Clinical rationale", body: rationale },
      { title: "Recommendation", body: recommendation },
      { title: "Referral / action", body: referralAction },
    ];

    for (const block of blocks) {
      const lines = wrapText(block.body, this.fonts.regular, 9.5, innerW);
      const blockH = 20 + lines.length * 12 + boxPad;

      this.ensureSpace(blockH + 8);
      const boxY = this.y - blockH;
      this.drawRect(MARGIN, boxY, CONTENT_W, blockH, {
        fill: COLORS.white,
        border: COLORS.border,
      });
      this.drawText(block.title, MARGIN + boxPad, this.y - 16, 8, this.fonts.bold, COLORS.textMuted);

      let lineY = this.y - 30;
      for (const line of lines) {
        this.drawText(line, MARGIN + boxPad, lineY, 9.5, this.fonts.regular, COLORS.text);
        lineY -= 12;
      }

      this.y = boxY - 14;
    }
  }

  render(input: MedicalPdfDocumentInput): void {
    const { sections, domains, katzRows, report, rationale, recommendation } = input;
    const demographics = sections[0]?.rows ?? [];

    const patientPairs = demographics
      .filter((row) =>
        ["Full name", "Age", "Sex (at birth)", "Education"].includes(row.label),
      )
      .map((row) => ({ label: row.label, value: row.value }));

    if (patientPairs.length === 0) {
      patientPairs.push(
        {
          label: "Full name",
          value: report.demographics.fullName || "Not provided",
        },
        { label: "Age", value: String(report.demographics.age) },
      );
    }

    this.drawReportHeader(input);

    this.drawSectionHeading("Patient Information");
    this.drawKeyValueGrid(patientPairs, 2);

    this.drawSectionHeading("Score Summary");
    this.drawScoreSummary(input);

    this.drawSectionHeading("MoCA-P Domain Breakdown");
    this.drawTable(
      [
        { header: "Domain", width: CONTENT_W * 0.44 },
        { header: "Score", width: CONTENT_W * 0.16, align: "center" },
        { header: "Maximum", width: CONTENT_W * 0.14, align: "center" },
        { header: "Clinical status", width: CONTENT_W * 0.26, align: "right" },
      ],
      domains.map((d) => [
        d.title,
        `${d.score}/${d.maxScore}`,
        String(d.maxScore),
        domainStatusLabel(d.status),
      ]),
    );

    this.drawSectionHeading("Katz ADL Breakdown");
    this.drawTable(
      [
        { header: "Activity", width: CONTENT_W * 0.42 },
        { header: "Functional status", width: CONTENT_W * 0.34, align: "center" },
        { header: "Points", width: CONTENT_W * 0.24, align: "right" },
      ],
      [
        ...katzRows.map((k) => [
          k.label,
          katzStatusLabel(k.response),
          String(k.score),
        ]),
        ["Total Katz ADL score", "Summary", `${report.katz.total} / 6`],
      ],
      { rowHeight: 24 },
    );

    this.drawClinicalNotes(
      report.interpretation.matrixInterpretation,
      rationale,
      recommendation,
      recommendation,
    );
  }
}

export async function buildMedicalAssessmentPdf(
  input: MedicalPdfDocumentInput,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(
    sanitizePdfText(`Medical Cognitive Assessment - ${input.recordId}`),
  );
  pdfDoc.setAuthor("DementiAware");
  pdfDoc.setSubject("Clinical assessment report");

  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const writer = new MedicalPdfWriter(pdfDoc, { regular, bold });
  writer.render(input);
  return writer.save();
}
