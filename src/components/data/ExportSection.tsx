import { Card } from "../ui/Card";

interface ExportSectionProps {
  onExportProgressHtml: () => void;
  onExportBackup: () => void;
}

export function ExportSection({ onExportProgressHtml, onExportBackup }: ExportSectionProps) {
  return (
    <Card className="reveal">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-success)]/12 text-[var(--color-success)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </span>
        <h2 className="text-xl font-bold">Esporta dati</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 p-4 transition-colors hover:border-[var(--color-accent)]/40">
          <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[var(--color-accent-2)] opacity-10 blur-xl transition-opacity group-hover:opacity-20" />
          <h3 className="font-bold">Dashboard progressi</h3>
          <p className="text-sm text-gray-400">Report HTML interattivo con animazioni e statistiche.</p>
          <button onClick={onExportProgressHtml} className="btn btn-secondary mt-3">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
            </svg>
            Scarica progress.html
          </button>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 p-4 transition-colors hover:border-[var(--color-accent)]/40">
          <span className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[var(--color-accent-3)] opacity-10 blur-xl transition-opacity group-hover:opacity-20" />
          <h3 className="font-bold">Backup completo</h3>
          <p className="text-sm text-gray-400">Domande, progressi e impostazioni. Reimportabile.</p>
          <button onClick={onExportBackup} className="btn btn-secondary mt-3">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
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
