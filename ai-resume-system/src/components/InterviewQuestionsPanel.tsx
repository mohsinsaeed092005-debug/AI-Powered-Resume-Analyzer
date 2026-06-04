"use client";

import { memo } from "react";

interface InterviewQuestionsPanelProps {
  questions: string;
}

function InterviewQuestionsPanel({ questions }: InterviewQuestionsPanelProps) {
  if (!questions) return null;

  return (
    <pre className="whitespace-pre-wrap rounded-xl border bg-white p-4 text-sm">
      {questions}
    </pre>
  );
}

export default memo(InterviewQuestionsPanel);
