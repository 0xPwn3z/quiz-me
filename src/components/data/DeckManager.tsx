import { Card } from "../ui/Card";
import type { StoredDeck } from "../../types";

interface DeckManagerProps {
  decks: StoredDeck[];
  onDelete: (id: string) => void;
}

export function DeckManager({ decks, onDelete }: DeckManagerProps) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Mazzi importati</h2>
      {decks.length === 0 ? (
        <p className="py-4 text-center text-gray-400">Nessun mazzo importato.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {decks.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-3"
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
