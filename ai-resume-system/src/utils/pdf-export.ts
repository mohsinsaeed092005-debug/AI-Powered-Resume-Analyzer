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
    dark?: boolean;
    sidebarDark?: boolean;
    photo?: boolean;
  }
> = {
  "pure-ats": {
    headerBg: [48, 50, 54],
    headerText: [17, 24, 39],
    sectionHeading: [17, 24, 39],
    bodyText: [31, 41, 55],
    borderGray: [14, 165, 233],
    bulletGray: [75, 85, 99],
    sidebar: true,
    sidebarDark: true,
    photo: true,
  },
  specialist: {
    headerBg: [13, 13, 12],
    headerText: [255, 255, 255],
    sectionHeading: [201, 162, 39],
    bodyText: [229, 229, 229],
    borderGray: [64, 64, 64],
    bulletGray: [180, 180, 180],
    dark: true,
  },
  clean: {
    headerBg: [7, 17, 31],
    headerText: [226, 232, 240],
    sectionHeading: [0, 183, 255],
    bodyText: [203, 213, 225],
    borderGray: [30, 58, 95],
    bulletGray: [148, 163, 184],
    sidebar: true,
    sidebarDark: true,
    dark: true,
  },
  "simple-ats": {
    headerBg: [111, 91, 208],
    headerText: [255, 255, 255],
    sectionHeading: [111, 91, 208],
    bodyText: [51, 65, 85],
    borderGray: [221, 214, 254],
    bulletGray: [100, 116, 139],
    photo: true,
  },
  corporate: {
    headerBg: [23, 57, 31],
    headerText: [255, 255, 255],
    sectionHeading: [79, 138, 59],
    bodyText: [31, 41, 55],
    borderGray: [170, 180, 150],
    bulletGray: [75, 85, 99],
    sidebar: true,
  },
  clear: {
    headerBg: [29, 25, 22],
    headerText: [255, 255, 255],
    sectionHeading: [201, 131, 49],
    bodyText: [229, 229, 229],
    borderGray: [74, 69, 64],
    bulletGray: [168, 162, 158],
    dark: true,
  },
  "precision-ats": {
    headerBg: [255, 253, 246],
    headerText: [34, 34, 34],
    sectionHeading: [196, 98, 45],
    bodyText: [51, 65, 85],
    borderGray: [231, 224, 209],
    bulletGray: [120, 113, 108],
    plainHeader: true,
  },
  "two-column-ats": {
    headerBg: [15, 26, 46],
    headerText: [255, 255, 255],
    sectionHeading: [59, 130, 246],
    bodyText: [51, 65, 85],
    borderGray: [191, 219, 254],
    bulletGray: [100, 116, 139],
    sidebar: true,
    sidebarDark: true,
    photo: true,
  },
};

export async function exportResumePdf(
  content: string,
  fileName = "resume.pdf",
  template: TemplateName = DEFAULT_TEMPLATE,
  profilePhoto?: string
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
  let sidebarY = 54;

  if (colors.dark) {
    doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  }

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
      if (!colors.plainHeader && !colors.sidebar) {
        doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
        doc.rect(0, 0, pageWidth, 34, "F");
      }

      if (colors.sidebar) {
        doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
        doc.rect(0, 0, margin + sidebarWidth, pageHeight, "F");
        doc.setFillColor(255, 255, 255);
        doc.rect(margin + sidebarWidth, 0, pageWidth - margin - sidebarWidth, pageHeight, "F");
        if (!colors.sidebarDark) {
          doc.setFillColor(243, 240, 230);
          doc.rect(0, 34, margin + sidebarWidth, pageHeight - 34, "F");
        }
      }

      if (profilePhoto && colors.photo) {
        try {
          const photoX = colors.sidebar ? 18 : margin;
          const photoY = colors.sidebar ? 12 : 9;
          const photoSize = colors.sidebar ? 28 : 18;
          doc.addImage(profilePhoto, "JPEG", photoX, photoY, photoSize, photoSize);
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(1);
          doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, "S");
        } catch {
          // Ignore invalid browser image data and continue exporting the resume.
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(colors.sidebar ? 20 : 22);
      setTextColor(colors.headerText);
      doc.text(line, colors.sidebar ? contentX : profilePhoto && colors.photo ? margin + 24 : margin, 14);
      if (colors.plainHeader) {
        doc.setDrawColor(colors.borderGray[0], colors.borderGray[1], colors.borderGray[2]);
        doc.line(margin, 15, pageWidth - margin, 15);
        y = 22;
      } else {
        y = colors.sidebar ? 24 : 24;
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
        doc.text(contactLine, colors.sidebar ? contentX : profilePhoto && colors.photo ? margin + 24 : margin, y);
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

    const sidebarHeader = colors.sidebar && /SKILLS|EDUCATION|LANGUAGES|CERTIFICATIONS/i.test(line);
    if (sidebarHeader && sidebarY < pageHeight - 20) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setTextColor(colors.sidebarDark ? [255, 255, 255] : colors.sectionHeading);
      doc.text(line.toUpperCase(), margin, sidebarY);
      sidebarY += 5;
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

