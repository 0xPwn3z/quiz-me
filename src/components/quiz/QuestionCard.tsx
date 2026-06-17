import { Card } from "../ui/Card";

interface QuestionCardProps {
  questionText: string;
  choices: string[];
  answered: boolean;
  selectedIndex?: number;
  correctIndex: number;
  disabled: boolean;
  onSelect: (index: number) => void;
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
}: QuestionCardProps) {
  return (
    <Card className="px-5 py-8 sm:px-8">
      <h2 className="mb-6 text-xl font-bold leading-snug sm:text-2xl">{questionText}</h2>
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
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || answered}
              className={`btn justify-start gap-3 rounded-lg border px-4 py-3 text-left font-semibold transition-all ${
                !answered
                  ? "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                  : ""
              } ${extraClass}`}
              onClick={() => onSelect(idx)}
              aria-label={`Risposta ${idx + 1}: ${choice}${ariaExtra}`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-border)] text-xs font-extrabold text-gray-400"
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: esc(choice) }} />
            </button>
          );
        })}
      </div>
    </Card>
  );
}
