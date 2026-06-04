import { NextRequest } from "next/server";
import { PDFParse } from "pdf-parse";
import { extractSkills } from "@/lib/skills";
import { predictRoles } from "@/lib/predict";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return Response.json(
        { error: "No resume file uploaded" },
        { status: 400 }
      );
    }

    const allowedTypes = ["application/pdf", "text/plain"];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Only PDF and TXT files are supported" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return Response.json(
        { error: "File size must be under 5 MB" },
        { status: 400 }
      );
    }

    let text = "";

    if (file.type === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else {
      text = await file.text();
    }

    if (!text.trim()) {
      return Response.json(
        { error: "Could not extract text from the resume" },
        { status: 422 }
      );
    }

    const skills = extractSkills(text);
    const predictions = predictRoles(skills);

    return Response.json({
      extractedText: text.slice(0, 2000),
      skills,
      predictions,
    });
  } catch {
    return Response.json(
      { error: "Failed to process the resume. Please try again." },
      { status: 500 }
    );
  }
}
