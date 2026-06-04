"use client";

import { memo, useCallback, useState } from "react";
import { Download } from "lucide-react";

interface DownloadPDFButtonProps {
  content: string;
  fileName?: string;
}

function DownloadPDFButton({
  content,
  fileName = "resume.pdf",
}: DownloadPDFButtonProps) {
  const [exporting, setExporting] = useState(false);

  const downloadPDF = useCallback(async () => {
    if (!content || exporting) return;
    setExporting(true);
    try {
      const { exportResumePdf } = await import("@/utils/pdf-export");
      await exportResumePdf(content, fileName);
    } finally {
      setExporting(false);
    }
  }, [content, fileName, exporting]);

  return (
    <button
      type="button"
      onClick={downloadPDF}
      disabled={!content || exporting}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={16} />
      {exporting ? "Preparing PDF..." : "Download PDF"}
    </button>
  );
}

export default memo(DownloadPDFButton);
