import { Card } from "../ui/Card";

interface ResetSectionProps {
  onReset: () => void;
}

export function ResetSection({ onReset }: ResetSectionProps) {
  return (
    <Card className="reveal">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-error)]/12 text-[var(--color-error)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </span>
        <h2 className="text-xl font-bold">Reset applicazione</h2>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        Cancella tutti i mazzi, le statistiche e le impostazioni. Operazione irreversibile.
      </p>
      <button
        onClick={() => {
          if (confirm("Sei sicuro di voler cancellare tutti i dati? Questa operazione è irreversibile.")) {
            onReset();
          }
        }}
        className="btn btn-danger"
      >
        Resetta tutto
      </button>
    </Card>
  );
}
