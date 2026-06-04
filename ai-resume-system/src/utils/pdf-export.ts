const SECTION_HEADERS = [
  "PROFESSIONAL SUMMARY",
  "CORE SKILLS",
  "CORE COMPETENCIES",
  "TECHNICAL SKILLS",
  "PROFESSIONAL EXPERIENCE",
  "EXPERIENCE",
  "KEY PROJECTS",
  "PROJECTS",
  "EDUCATION",
  "CERTIFICATIONS",
];

// Color scheme
const COLORS = {
  headerBg: [26, 42, 71], // Dark blue background
  headerText: [255, 255, 255], // White text
  sectionHeading: [30, 78, 216], // Blue headings
  bodyText: [51, 65, 85], // Dark gray/black
  borderGray: [226, 232, 240], // Light gray for borders
  bulletGray: [100, 116, 139], // Muted gray for details
};

export async function exportResumePdf(content: string, fileName = "resume.pdf") {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const maxWidth = pageWidth - margin * 2;
  let y = 15;

  const addText = (
    text: string,
    size = 10,
    bold = false,
    color = COLORS.bodyText,
    gap = 5
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 15;
      }
      doc.text(line, margin, y);
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
      // Draw dark blue header background
      doc.setFillColor(COLORS.headerBg[0], COLORS.headerBg[1], COLORS.headerBg[2]);
      doc.rect(0, 0, pageWidth, 28, "F");

      // Add name in white, bold
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(COLORS.headerText[0], COLORS.headerText[1], COLORS.headerText[2]);
      doc.text(line, margin, 10);
      y = 18;
      isFirstName = false;
      continue;
    }

    if (isContact) {
      // Add contact info in white on blue header
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(COLORS.headerText[0], COLORS.headerText[1], COLORS.headerText[2]);
      const contactLines = doc.splitTextToSize(line, maxWidth);
      for (const contactLine of contactLines) {
        doc.text(contactLine, margin, y);
        y += 4;
      }
      y += 6; // Add gap after header
      isFirstContact = false;
      continue;
    }

    if (line.startsWith("---")) {
      y += 1;
      continue;
    }

    if (isHeader) {
      y += 3;
      // Section heading in blue
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(COLORS.sectionHeading[0], COLORS.sectionHeading[1], COLORS.sectionHeading[2]);
      doc.text(line.toUpperCase(), margin, y);
      y += 6;

      // Add subtle line under heading
      doc.setDrawColor(COLORS.borderGray[0], COLORS.borderGray[1], COLORS.borderGray[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, y - 1, pageWidth - margin, y - 1);
      y += 2;
      continue;
    }

    // Body text
    if (line.startsWith("-")) {
      // Bullet point in dark text
      addText(line, 10, false, COLORS.bodyText, 4.5);
    } else if (line.includes("|")) {
      // Role/experience line with details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(COLORS.bodyText[0], COLORS.bodyText[1], COLORS.bodyText[2]);
      const parts = line.split("|");
      const role = parts[0].trim();
      doc.text(role, margin, y);
      
      // Add secondary info on the right
      if (parts.length > 1) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(COLORS.bulletGray[0], COLORS.bulletGray[1], COLORS.bulletGray[2]);
        const secondary = parts.slice(1).join(" | ").trim();
        doc.text(secondary, pageWidth - margin - doc.getTextWidth(secondary), y);
      }
      y += 5.5;
    } else {
      // Regular text
      addText(line, 10, false, COLORS.bodyText, 5);
    }
  }

  doc.save(fileName);
}

