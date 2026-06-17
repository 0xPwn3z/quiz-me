import { Card } from "../ui/Card";

interface ExportSectionProps {
  onExportProgressHtml: () => void;
  onExportBackup: () => void;
}

export function ExportSection({ onExportProgressHtml, onExportBackup }: ExportSectionProps) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Esporta dati</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-4 dark:bg-gray-800/50">
          <h3 className="font-bold">Dashboard progressi</h3>
          <p className="text-sm text-gray-400">Report HTML completo con statistiche e grafici.</p>
          <button onClick={onExportProgressHtml} className="btn btn-secondary mt-3">
            Scarica progress.html
          </button>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-4 dark:bg-gray-800/50">
          <h3 className="font-bold">Backup completo</h3>
          <p className="text-sm text-gray-400">Domande, progressi e impostazioni. Reimportabile.</p>
          <button onClick={onExportBackup} className="btn btn-secondary mt-3">
            Scarica backup.json
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        Il backup.json può essere reimportato tramite la sezione "Importa un mazzo" qui sopra.
      </p>
    </Card>
  );
}
