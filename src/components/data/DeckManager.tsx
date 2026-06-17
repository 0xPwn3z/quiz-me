import { Card } from "../ui/Card";
import type { StoredDeck } from "../../types";

interface DeckManagerProps {
  decks: StoredDeck[];
  onDelete: (id: string) => void;
}

export function DeckManager({ decks, onDelete }: DeckManagerProps) {
  return (
    <Card className="reveal">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-3)]/12 text-[var(--color-accent-3)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </span>
        <h2 className="text-xl font-bold">Mazzi importati</h2>
      </div>
      {decks.length === 0 ? (
        <p className="py-4 text-center text-gray-400">Nessun mazzo importato.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {decks.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 p-3.5 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <div className="flex-1">
                <strong className="block">{d.name}</strong>
                <small className="text-sm text-gray-400">
                  {d.questions.length} domande — importato{" "}
                  {new Date(d.importedAt).toLocaleDateString()}
                </small>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Eliminare il mazzo "${d.name}"?`)) onDelete(d.id);
                }}
                className="btn btn-danger px-3 py-1.5 text-sm"
                aria-label={`Elimina mazzo ${d.name}`}
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
