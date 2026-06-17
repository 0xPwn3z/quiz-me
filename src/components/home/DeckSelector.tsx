import { useApp } from "../../context/AppContext";
import type { StoredDeck } from "../../types";

interface DeckSelectorProps {
  decks: StoredDeck[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function DeckSelector({ decks, selectedIds, onToggle }: DeckSelectorProps) {
  const { navigate } = useApp();

  if (decks.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        Nessun mazzo importato. Vai su{" "}
        <button
          onClick={() => navigate("data")}
          className="font-semibold text-[var(--color-accent)] underline"
        >
          Dati
        </button>{" "}
        per importarne uno.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {decks.map((deck) => (
        <label
          key={deck.id}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
            selectedIds.has(deck.id)
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedIds.has(deck.id)}
            onChange={() => onToggle(deck.id)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="flex-1 font-semibold">{deck.name}</span>
          <span className="text-sm text-gray-400">{deck.questions.length} domande</span>
        </label>
      ))}
    </div>
  );
}
