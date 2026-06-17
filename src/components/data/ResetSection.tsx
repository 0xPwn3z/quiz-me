import { Card } from "../ui/Card";

interface ResetSectionProps {
  onReset: () => void;
}

export function ResetSection({ onReset }: ResetSectionProps) {
  return (
    <Card>
      <h2 className="mb-2 text-xl font-bold">Reset applicazione</h2>
      <p className="mb-3 text-sm text-gray-400">
        Cancella tutti i mazzi, le statistiche e le impostazioni.
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
