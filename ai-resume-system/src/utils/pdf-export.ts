import { DEFAULT_TEMPLATE, type TemplateName } from "@/templates";

const SECTION_HEADERS = [
  "PROFESSIONAL SUMMARY",
  "PROFILE",
  "CORE SKILLS",
  "CORE COMPETENCIES",
  "TECHNICAL SKILLS",
  "PROFESSIONAL EXPERIENCE",
  "WORK EXPERIENCE",
  "EXPERIENCE",
  "KEY PROJECTS",
  "PROJECTS",
  "EDUCATION",
  "CERTIFICATIONS",
  "SKILLS",
];

type Rgb = [number, number, number];

const THEMES: Record<
  TemplateName,
  {
    headerBg: Rgb;
    headerText: Rgb;
    sectionHeading: Rgb;
    bodyText: Rgb;
    borderGray: Rgb;
    bulletGray: Rgb;
    sidebar?: boolean;
    plainHeader?: boolean;
  }
> = {
  "pure-ats": {
    headerBg: [255, 255, 255],
    headerText: [17, 24, 39],
    sectionHeading: [17, 24, 39],
    bodyText: [31, 41, 55],
    borderGray: [156, 163, 175],
    bulletGray: [75, 85, 99],
    plainHeader: true,
  },
  specialist: {
    headerBg: [26, 42, 71],
    headerText: [255, 255, 255],
    sectionHeading: [30, 78, 216],
    bodyText: [51, 65, 85],
    borderGray: [226, 232, 240],
    bulletGray: [100, 116, 139],
  },
  clean: {
    headerBg: [248, 250, 252],
    headerText: [15, 23, 42],
    sectionHeading: [15, 23, 42],
    bodyText: [51, 65, 85],
    borderGray: [203, 213, 225],
    bulletGray: [100, 116, 139],
    sidebar: true,
  },
  "simple-ats": {
    headerBg: [255, 255, 255],
    headerText: [37, 99, 235],
    sectionHeading: [37, 99, 235],
    bodyText: [51, 65, 85],
    borderGray: [191, 219, 254],
    bulletGray: [100, 116, 139],
    plainHeader: true,
  },
  corporate: {
    headerBg: [248, 250, 252],
    headerText: [17, 24, 39],
    sectionHeading: [17, 24, 39],
    bodyText: [31, 41, 55],
    borderGray: [203, 213, 225],
    bulletGray: [75, 85, 99],
    sidebar: true,
  },
  clear: {
    headerBg: [74, 222, 128],
    headerText: [15, 23, 42],
    sectionHeading: [15, 23, 42],
    bodyText: [51, 65, 85],
    borderGray: [187, 247, 208],
    bulletGray: [100, 116, 139],
    sidebar: true,
  },
  "precision-ats": {
    headerBg: [255, 255, 255],
    headerText: [196, 98, 45],
    sectionHeading: [196, 98, 45],
    bodyText: [51, 65, 85],
    borderGray: [254, 215, 170],
    bulletGray: [120, 113, 108],
    plainHeader: true,
  },
  "two-column-ats": {
    headerBg: [255, 247, 237],
    headerText: [196, 98, 45],
    sectionHeading: [196, 98, 45],
    bodyText: [51, 65, 85],
    borderGray: [254, 215, 170],
    bulletGray: [120, 113, 108],
    sidebar: true,
  },
};

export async function exportResumePdf(
  content: string,
  fileName = "resume.pdf",
  template: TemplateName = DEFAULT_TEMPLATE
) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const colors = THEMES[template];
  const sidebarWidth = colors.sidebar ? 52 : 0;
  const contentX = colors.sidebar ? margin + sidebarWidth + 8 : margin;
  const maxWidth = pageWidth - contentX - margin;
  let y = colors.plainHeader ? 18 : 36;

  const setTextColor = (color: Rgb) => doc.setTextColor(color[0], color[1], color[2]);

  const addText = (
    text: string,
    size = 10,
    bold = false,
    color = colors.bodyText,
    gap = 5
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, contentX, y);
      y += gap;
    }
  };

  const lines = content.replace(/\r/g, "").split("\n");
  let isFirstName = true;
  let isFirstContact = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      y += 2;
      continue;
    }

    const isHeader = SECTION_HEADERS.includes(line.toUpperCase());
    const isName = isFirstName && i === 0;
    const isContact = isFirstContact && i === 1 && line.includes("@");

    if (isName) {
      if (!colors.plainHeader) {
        doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
        doc.rect(0, 0, pageWidth, 28, "F");
      }

      if (colors.sidebar) {
        doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
        doc.rect(0, 0, pageWidth, 30, "F");
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 30, margin + sidebarWidth, pageHeight - 30, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(colors.sidebar ? 20 : 22);
      setTextColor(colors.headerText);
      doc.text(line, margin, 10);
      if (colors.plainHeader) {
        doc.setDrawColor(colors.borderGray[0], colors.borderGray[1], colors.borderGray[2]);
        doc.line(margin, 15, pageWidth - margin, 15);
        y = 22;
      } else {
        y = 18;
      }
      isFirstName = false;
      continue;
    }

    if (isContact) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setTextColor(colors.headerText);
      const contactLines = doc.splitTextToSize(line, maxWidth);
      for (const contactLine of contactLines) {
        doc.text(contactLine, margin, y);
        y += 4;
      }
      y += colors.plainHeader ? 3 : 6;
      isFirstContact = false;
      continue;
    }

    if (line.startsWith("---")) {
      y += 1;
      continue;
    }

    if (isHeader) {
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setTextColor(colors.sectionHeading);
      doc.text(line.toUpperCase(), contentX, y);
      y += 6;

      doc.setDrawColor(colors.borderGray[0], colors.borderGray[1], colors.borderGray[2]);
      doc.setLineWidth(0.3);
      doc.line(contentX, y - 1, pageWidth - margin, y - 1);
      y += 2;
      continue;
    }

    if (line.startsWith("-")) {
      addText(line, 10, false, colors.bodyText, 4.5);
    } else if (line.includes("|")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setTextColor(colors.bodyText);
      const parts = line.split("|");
      const role = parts[0].trim();
      doc.text(role, contentX, y);
      
      if (parts.length > 1) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setTextColor(colors.bulletGray);
        const secondary = parts.slice(1).join(" | ").trim();
        doc.text(secondary, pageWidth - margin - doc.getTextWidth(secondary), y);
      }
      y += 5.5;
    } else {
      addText(line, 10, false, colors.bodyText, 5);
    }
  }

  doc.save(fileName);
}

