interface FeedbackBarProps {
  isCorrect?: boolean;
}

export function FeedbackBar({ isCorrect }: FeedbackBarProps) {
  if (isCorrect === undefined) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={`min-h-[1.5rem] text-lg font-bold ${
        isCorrect ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
      }`}
    >
      {isCorrect ? "Corretto!" : "Sbagliato. La risposta corretta è evidenziata."}
    </p>
  );
}
