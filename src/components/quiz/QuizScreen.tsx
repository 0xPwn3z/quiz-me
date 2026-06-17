import { useEffect, useCallback, useRef } from "react";
import { useTimer } from "../../hooks/useTimer";
import { QuizMeta } from "./QuizMeta";
import { QuestionCard } from "./QuestionCard";
import { FeedbackBar } from "./FeedbackBar";
import type { QuizAPI } from "../../hooks/useQuiz";
import type { QuizMode } from "../../types";

interface QuizScreenProps {
  quiz: QuizAPI;
  onFinish: (score: number, total: number, durationMs: number, mode: QuizMode) => void;
}

export function QuizScreen({ quiz, onFinish }: QuizScreenProps) {
  const timer = useTimer();

  const item = quiz.state.session[quiz.state.currentIndex] ?? null;
  const lastResultRef = useRef<{
    isCorrect: boolean;
    correctIndex: number;
    selectedIndex: number;
  } | null>(null);

  useEffect(() => {
    if (quiz.state.phase === "active" && quiz.state.session.length > 0) {
      timer.start();
    }
  }, [quiz.state.phase, quiz.state.session.length]);

  const handleSelect = useCallback(
    (idx: number) => {
      const result = quiz.answer(idx);
      if (result) {
        lastResultRef.current = result;
      }
    },
    [quiz],
  );

  const handleNext = useCallback(() => {
    lastResultRef.current = null;
    const hasMore = quiz.next();
    if (!hasMore) {
      const duration = timer.stop();
      onFinish(quiz.state.score, quiz.state.session.length, duration, quiz.state.mode);
    }
  }, [quiz, timer, onFinish]);

  // Keyboard: 1-9 for answer, Enter for next
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (quiz.state.phase === "active") {
        const num = parseInt(e.key, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= 9) {
          e.preventDefault();
          handleSelect(num - 1);
          return;
        }
      }
      if (quiz.state.phase === "answered" && e.key === "Enter") {
        e.preventDefault();
        handleNext();
        return;
      }
      if ((e.key === "r" || e.key === "R") && (quiz.state.phase === "active" || quiz.state.phase === "answered")) {
        e.preventDefault();
        const duration = timer.stop();
        onFinish(quiz.state.score, quiz.state.session.length, duration, quiz.state.mode);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz.state.phase, handleSelect, handleNext, timer, onFinish, quiz.state.score, quiz.state.session.length]);

  if (!item) return null;

  return (
    <div className="flex flex-col gap-4">
      <QuizMeta
        current={Math.min(quiz.progress.current, quiz.progress.total)}
        total={quiz.progress.total}
        score={quiz.state.score}
        percent={quiz.progress.percent}
        elapsed={timer.formatted}
      />
      <QuestionCard
        questionText={item.question.q}
        choices={item.choices}
        answered={item.answered}
        selectedIndex={item.selected}
        correctIndex={item.correctChoiceIndex}
        disabled={quiz.state.phase !== "active"}
        onSelect={handleSelect}
        questionKey={quiz.state.currentIndex}
      />
      <FeedbackBar
        isCorrect={
          item.answered
            ? lastResultRef.current?.isCorrect
            : undefined
        }
      />
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={quiz.state.phase !== "answered"}
          className="btn btn-primary"
          aria-label="Domanda successiva (Invio)"
        >
          Avanti <span className="text-sm opacity-60">↩</span>
        </button>
      </div>
    </div>
  );
}
