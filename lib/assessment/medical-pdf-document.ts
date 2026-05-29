import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type {
  PDFDocument as PDFDocumentType,
  PDFFont,
  PDFImage,
  PDFPage,
  RGB,
} from "pdf-lib";
import type {
  DomainBreakdownRow,
  KatzResultRow,
  MedicalReportPayload,
  PrintReportSection,
} from "./medical-report-types";
import { validateAndNormalizeMedicalReport } from "./medical-report-utils";

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
  logoPngBytes?: Uint8Array;
  headerTitle?: string;
  headerSubtitle?: string;
  preparedForNote?: string;
  disclaimer?: string;
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
  private readonly disclaimer?: string;
  private readonly headerTitle?: string;
  private readonly headerSubtitle?: string;
  private readonly preparedForNote?: string;
  private readonly logo?: PDFImage;

  constructor(
    pdfDoc: PDFDocumentType,
    fonts: Fonts,
    disclaimer?: string,
    header?: Pick<
      MedicalPdfDocumentInput,
      "headerTitle" | "headerSubtitle" | "preparedForNote"
    >,
    logo?: PDFImage,
  ) {
    this.pdfDoc = pdfDoc;
    this.fonts = fonts;
    this.page = pdfDoc.addPage(PAGE_SIZE);
    this.pages.push(this.page);
    this.y = PAGE_H - MARGIN;
    this.disclaimer = disclaimer;
    this.headerTitle = header?.headerTitle;
    this.headerSubtitle = header?.headerSubtitle;
    this.preparedForNote = header?.preparedForNote;
    this.logo = logo;
  }

  private drawPrintLikeHeader(): void {
    // Mimic `components/assessment/medical/print-report.tsx` header.
    const title = this.headerTitle ?? "DementiAware Clinical Summary";
    const subtitle =
      this.headerSubtitle ?? "Medical Professional / Trained Specialist Report";
    const preparedFor =
      this.preparedForNote ??
      "Prepared for restricted Clinical Central Dashboard record";

    const headerTop = this.y;
    const headerRowH = 58;
    let headerBottom = headerTop - headerRowH;

    if (this.logo) {
      const maxLogoH = 50;
      const maxLogoW = 200;
      const scale = Math.min(
        maxLogoW / this.logo.width,
        maxLogoH / this.logo.height,
      );
      const logoW = this.logo.width * scale;
      const logoH = this.logo.height * scale;

      const titleX = MARGIN + logoW + 14;
      const titleBlockW = Math.max(CONTENT_W - (titleX - MARGIN), 160);

      this.page.drawImage(this.logo, {
        x: MARGIN,
        y: headerTop - logoH,
        width: logoW,
        height: logoH,
      });

      const titleLines = wrapText(title, this.fonts.bold, 16, titleBlockW);
      let titleY = headerTop - 18;
      for (const line of titleLines) {
        this.drawText(line, titleX, titleY, 16, this.fonts.bold, COLORS.text);
        titleY -= 18;
      }

      const subLines = wrapText(subtitle, this.fonts.regular, 9, titleBlockW);
      let subY = titleY - 4;
      for (const line of subLines) {
        this.drawText(
          line,
          titleX,
          subY,
          9,
          this.fonts.regular,
          COLORS.textMuted,
        );
        subY -= 11;
      }

      headerBottom = Math.min(headerTop - logoH, subY - 6);
    } else {
      this.drawText(
        title,
        MARGIN,
        headerTop - 18,
        16,
        this.fonts.bold,
        COLORS.text,
      );
      this.drawText(
        subtitle,
        MARGIN,
        headerTop - 34,
        9,
        this.fonts.regular,
        COLORS.textMuted,
      );
      headerBottom = headerTop - headerRowH;
    }

    const borderY = headerBottom - 8;
    this.page.drawRectangle({
      x: MARGIN,
      y: borderY,
      width: CONTENT_W,
      height: 4,
      color: COLORS.purple,
    });

    // Prepared-for note box
    const noteTop = borderY - 12;
    const noteLines = wrapText(
      preparedFor,
      this.fonts.regular,
      9,
      CONTENT_W - 24,
    );
    const noteH = 14 + noteLines.length * 12 + 10;
    this.drawRect(MARGIN, noteTop - noteH, CONTENT_W, noteH, {
      fill: COLORS.purpleLight,
      border: COLORS.purpleLine,
    });
    this.drawText(
      preparedFor,
      MARGIN + 12,
      noteTop - 20,
      9,
      this.fonts.bold,
      COLORS.purpleDark,
    );

    this.y = noteTop - noteH - 18;
  }

  private drawSectionCards(section: PrintReportSection): void {
    // Title
    this.ensureSpace(26);
    this.drawText(
      section.title,
      MARGIN,
      this.y - 14,
      13,
      this.fonts.bold,
      COLORS.text,
    );
    this.advance(22);

    // 2-column card grid
    const colGap = 10;
    const cardW = (CONTENT_W - colGap) / 2;
    const cardPadX = 10;
    const headerSize = 7.5;
    const valueSize = 10;
    const cardH = 44;

    for (let i = 0; i < section.rows.length; i += 2) {
      this.ensureSpace(cardH + 10);
      const rowTop = this.y;

      const drawCard = (x: number, label: string, value: string) => {
        this.drawRect(x, rowTop - cardH, cardW, cardH, {
          fill: COLORS.white,
          border: COLORS.border,
        });
        this.drawText(
          label.toUpperCase(),
          x + cardPadX,
          rowTop - 16,
          headerSize,
          this.fonts.bold,
          COLORS.textMuted,
        );

        const lines = wrapText(
          value,
          this.fonts.bold,
          valueSize,
          cardW - cardPadX * 2,
        );
        this.drawText(
          lines[0] ?? "",
          x + cardPadX,
          rowTop - 32,
          valueSize,
          this.fonts.bold,
          COLORS.text,
        );
      };

      const left = section.rows[i];
      drawCard(MARGIN, left.label, left.value);

      const right = section.rows[i + 1];
      if (right) {
        drawCard(MARGIN + cardW + colGap, right.label, right.value);
      }

      this.y = rowTop - cardH - 10;
    }
  }

  private drawInterpretationBox(
    title: string,
    matrixInterpretation: string,
    exactClassification: string,
    rationale: string,
    recommendation: string,
  ): void {
    this.ensureSpace(120);
    this.drawRect(MARGIN, this.y - 0, CONTENT_W, 0, {}); // no-op for spacing consistency

    // Outer box
    const startY = this.y;
    // We'll compute height based on wrapped text, with pagination support by splitting blocks.
    // Keep it simple: draw as three stacked wrapped blocks with borders, similar to existing notes.

    this.drawRect(MARGIN, startY - 0, 0, 0, {}); // no-op

    // Title
    this.drawRect(MARGIN, startY - 0, 0, 0, {}); // no-op
    this.drawText(title, MARGIN, startY - 14, 13, this.fonts.bold, COLORS.text);
    this.y = startY - 24;

    // Interpretation headline
    // Show both Exact Classification and Overall Clinical Interpretation explicitly
    this.drawText(
      `Exact Classification: ${exactClassification}`,
      MARGIN,
      this.y - 18,
      11,
      this.fonts.bold,
      COLORS.purpleDark,
    );
    this.drawText(
      `Overall Clinical Interpretation: ${matrixInterpretation}`,
      MARGIN,
      this.y - 34,
      9,
      this.fonts.regular,
      COLORS.textMuted,
    );
    this.advance(46);

    const drawWrappedParagraph = (text: string) => {
      const lines = wrapText(text, this.fonts.regular, 9.5, CONTENT_W);
      this.ensureSpace(lines.length * 12 + 10);
      let y = this.y - 12;
      for (const line of lines) {
        this.drawText(line, MARGIN, y, 9.5, this.fonts.regular, COLORS.text);
        y -= 12;
      }
      this.y = y - 10;
    };

    drawWrappedParagraph(rationale);
    drawWrappedParagraph(recommendation);
  }

  private drawDisclaimerBlock(): void {
    if (!this.disclaimer) return;

    const lines = wrapText(this.disclaimer, this.fonts.regular, 8.5, CONTENT_W);
    const blockH = 14 + lines.length * 11 + 12;
    this.ensureSpace(blockH + 10);

    // Top divider line like Print footer.
    this.drawLine(MARGIN, this.y, PAGE_W - MARGIN, this.y, COLORS.border);
    this.advance(10);

    let y = this.y - 10;
    for (const line of lines) {
      this.drawText(line, MARGIN, y, 8.5, this.fonts.regular, COLORS.textLight);
      y -= 11;
    }
    this.y = y - 8;
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
      this.page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: options.fill,
      });
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

  private drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = COLORS.border,
  ): void {
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
    this.drawText(
      title.toUpperCase(),
      MARGIN,
      this.y - 11,
      9,
      this.fonts.bold,
      COLORS.purple,
    );
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
      page.drawText(
        sanitizePdfText("DementiAware  |  Confidential clinical report"),
        {
          x: MARGIN,
          y: footerY,
          size: 7.5,
          font: this.fonts.regular,
          color: COLORS.textLight,
        },
      );
      page.drawText(sanitizePdfText(`Page ${index + 1} of ${total}`), {
        x:
          PAGE_W -
          MARGIN -
          this.measureText(
            `Page ${index + 1} of ${total}`,
            7.5,
            this.fonts.regular,
          ),
        y: footerY,
        size: 7.5,
        font: this.fonts.regular,
        color: COLORS.textLight,
      });

      // Print version footer note (short & wrapped).
      if (this.disclaimer && index === total - 1) {
        const maxW = CONTENT_W - 20;
        const lines = wrapText(this.disclaimer, this.fonts.regular, 7, maxW);
        lines.slice(0, 3).forEach((line, i) => {
          page.drawText(sanitizePdfText(line), {
            x: MARGIN + 10,
            y: footerY - 10 - i * 9,
            size: 7,
            font: this.fonts.regular,
            color: COLORS.textLight,
          });
        });
      }
    });
  }

  // (Old dashboard-focused header removed; we now mirror Print layout.)

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
      this.drawText(
        pair.label,
        x,
        baseline + 11,
        7.5,
        this.fonts.regular,
        COLORS.textMuted,
      );
      this.drawText(pair.value, x, baseline, 10, this.fonts.bold, COLORS.text);
    });

    this.y = boxY - 16;
  }

  private drawScoreSummary(input: MedicalPdfDocumentInput): void {
    const { report, recommendation } = input;
    // report should already be validated; but tolerate if not.
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
      this.drawText(
        label,
        x + 12,
        y - 18,
        8,
        this.fonts.bold,
        COLORS.textMuted,
      );
      this.drawText(
        value,
        x + 12,
        y - 46,
        22,
        this.fonts.bold,
        accent ? COLORS.purple : COLORS.text,
      );
      this.drawText(
        sub,
        x + 12,
        y - 62,
        8,
        this.fonts.regular,
        COLORS.textMuted,
      );
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
    this.drawLine(
      MARGIN + half,
      row2Bottom - tallCardH,
      MARGIN + half,
      row2Bottom,
      COLORS.border,
    );

    this.drawText(
      "Clinical interpretation",
      MARGIN + 12,
      row2Bottom - 18,
      8,
      this.fonts.bold,
      COLORS.textMuted,
    );
    this.drawText(
      report.interpretation.matrixInterpretation,
      MARGIN + 12,
      row2Bottom - 40,
      11,
      this.fonts.bold,
      COLORS.purpleDark,
    );

    // Explicit exact classification label (do not substitute with dashboard category)
    this.drawText(
      `Exact Classification: ${report.interpretation.label}`,
      MARGIN + 12,
      row2Bottom - 54,
      9,
      this.fonts.regular,
      COLORS.textMuted,
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
    const startY = row2Bottom - 34;
    const minY = row2Bottom - tallCardH + 10;
    const maxLines = Math.max(1, Math.floor((startY - minY) / 11) + 1);

    referralLines.slice(0, maxLines).forEach((line, i) => {
      this.drawText(
        line,
        MARGIN + half + 12,
        row2Bottom - 34 - i * 11,
        9,
        this.fonts.regular,
        COLORS.text,
      );
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
      this.drawText(
        col.header,
        colX + 8,
        tableTop - 16,
        8,
        this.fonts.bold,
        COLORS.purpleDark,
      );
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
        textX =
          colX +
          (col.width - this.measureText(text, size, this.fonts.regular)) / 2;
      } else if (col.align === "right") {
        textX =
          colX +
          col.width -
          8 -
          this.measureText(text, size, this.fonts.regular);
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
      this.drawTableHeader(
        columns,
        tableX,
        tableW,
        tableTop,
        headerH,
        options?.headerFill,
      );
      tableTop -= headerH;
    };

    startTableSection();

    rows.forEach((row) => {
      if (tableTop - rowHeight < this.bottomLimit()) {
        this.y = tableTop - 8;
        startTableSection();
      }

      this.drawTableRow(
        columns,
        row,
        tableX,
        tableW,
        tableTop,
        rowHeight,
        rowCounter,
      );
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
    dashboardCategory?: string,
  ): void {
    this.drawSectionHeading("Clinical Notes & Interpretation");

    const boxPad = 14;
    const innerW = CONTENT_W - boxPad * 2;

    this.drawText(
      "Classification",
      MARGIN,
      this.y - 10,
      8,
      this.fonts.bold,
      COLORS.textMuted,
    );
    this.advance(14);
    this.drawRect(MARGIN, this.y - 26, CONTENT_W, 26, {
      fill: COLORS.purpleLight,
      border: COLORS.purpleLine,
    });
    // Show both fields explicitly per guideline
    this.drawText(
      `Exact Classification: ${dashboardCategory ?? "Not provided"}`,
      MARGIN + 12,
      this.y - 18,
      11,
      this.fonts.bold,
      COLORS.purpleDark,
    );
    this.drawText(
      `Overall Clinical Interpretation: ${interpretation}`,
      MARGIN + 12,
      this.y - 34,
      9,
      this.fonts.regular,
      COLORS.textMuted,
    );
    this.advance(46);

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
      this.drawText(
        block.title,
        MARGIN + boxPad,
        this.y - 16,
        8,
        this.fonts.bold,
        COLORS.textMuted,
      );

      let lineY = this.y - 30;
      for (const line of lines) {
        this.drawText(
          line,
          MARGIN + boxPad,
          lineY,
          9.5,
          this.fonts.regular,
          COLORS.text,
        );
        lineY -= 12;
      }

      this.y = boxY - 14;
    }
  }

  render(input: MedicalPdfDocumentInput): void {
    const { sections, domains, katzRows, report, rationale, recommendation } =
      input;
    this.drawPrintLikeHeader();

    // Mirror Print: render all `sections` as card grids (demographics + core scores).
    sections.forEach((section) => {
      this.drawSectionCards(section);
    });

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
        {
          header: "Functional status",
          width: CONTENT_W * 0.34,
          align: "center",
        },
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

    this.drawInterpretationBox(
      "Interpretation and Recommendation",
      report.interpretation.matrixInterpretation,
      report.interpretation.label,
      rationale,
      recommendation,
    );

    // Mirror Print footer note placement (in-body), not just page footer.
    this.drawDisclaimerBlock();
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

  const logo = input.logoPngBytes
    ? await pdfDoc.embedPng(input.logoPngBytes)
    : undefined;

  // Validate and normalize report payload to ensure consistency for PDF output.
  try {
    input.report = validateAndNormalizeMedicalReport(
      input.report as any,
    ) as any;
  } catch (e) {
    // proceed with original input if validation fails
  }

  const writer = new MedicalPdfWriter(
    pdfDoc,
    { regular, bold },
    input.disclaimer,
    {
      headerTitle: input.headerTitle,
      headerSubtitle: input.headerSubtitle,
      preparedForNote: input.preparedForNote,
    },
    logo,
  );

  writer.render(input);
  return writer.save();
}
