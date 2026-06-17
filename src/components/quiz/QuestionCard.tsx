import { Card } from "../ui/Card";

interface QuestionCardProps {
  questionText: string;
  choices: string[];
  answered: boolean;
  selectedIndex?: number;
  correctIndex: number;
  disabled: boolean;
  onSelect: (index: number) => void;
  /** Bumped each new question to retrigger entrance animation */
  questionKey: number;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function QuestionCard({
  questionText,
  choices,
  answered,
  selectedIndex,
  correctIndex,
  disabled,
  onSelect,
  questionKey,
}: QuestionCardProps) {
  return (
    <Card key={questionKey} className="px-5 py-7 sm:px-8 sm:py-9">
      <h2
        className="mb-6 text-balance font-display text-2xl font-bold leading-snug sm:text-3xl"
        style={{ animation: "pop-in 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {questionText}
      </h2>
      <div className="flex flex-col gap-2.5" role="group" aria-label="Risposte">
        {choices.map((choice, idx) => {
          let extraClass = "";
          let ariaExtra = "";
          if (answered) {
            if (idx === correctIndex) {
              extraClass = "border-[var(--color-success)] bg-[var(--color-success-bg)]";
              ariaExtra = " — corretta";
            } else if (idx === selectedIndex) {
              extraClass = "border-[var(--color-error)] bg-[var(--color-error-bg)]";
              ariaExtra = " — sbagliata";
            }
          }
          const wrongPicked = answered && idx === selectedIndex && selectedIndex !== correctIndex;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || answered}
              className={`btn group relative justify-start gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left font-semibold transition-all duration-200 ${
                !answered
                  ? "border-[var(--color-border)] hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 hover:shadow-md"
                  : ""
              } ${extraClass} ${wrongPicked ? "animate-shake" : ""}`}
              style={{
                animation: !answered
                  ? `pop-in 0.4s cubic-bezier(0.22,1,0.36,1) both`
                  : undefined,
                animationDelay: `${0.08 * idx + 0.1}s`,
              }}
              onClick={() => onSelect(idx)}
              aria-label={`Risposta ${idx + 1}: ${choice}${ariaExtra}`}
            >
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg border text-xs font-extrabold transition-colors ${
                  answered && (idx === correctIndex || idx === selectedIndex)
                    ? "border-transparent bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] text-gray-400 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]"
                }`}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <span
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: esc(choice) }}
              />
              {answered && idx === correctIndex && (
                <svg className="h-5 w-5 flex-none text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
              {wrongPicked && (
                <svg className="h-5 w-5 flex-none text-[var(--color-error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
