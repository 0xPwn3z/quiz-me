interface FeedbackBarProps {
  isCorrect?: boolean;
}

export function FeedbackBar({ isCorrect }: FeedbackBarProps) {
  if (isCorrect === undefined) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-lg font-bold ${
        isCorrect
          ? "border-[var(--color-success)]/30 bg-[var(--color-success-bg)] text-[var(--color-success)]"
          : "border-[var(--color-error)]/30 bg-[var(--color-error-bg)] text-[var(--color-error)]"
      }`}
      style={{ animation: "pop-in 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-current/15">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, currentColor 18%, transparent)" }}
        >
          {isCorrect ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          )}
        </span>
      </span>
      {isCorrect ? "Corretto!" : "Sbagliato. La risposta corretta è evidenziata."}
    </div>
  );
}
