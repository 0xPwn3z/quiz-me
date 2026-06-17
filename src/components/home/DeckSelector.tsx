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
          className="font-semibold text-[var(--color-accent)] underline underline-offset-2"
        >
          Dati
        </button>{" "}
        per importarne uno.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {decks.map((deck) => {
        const checked = selectedIds.has(deck.id);
        return (
          <label
            key={deck.id}
            className={`group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
              checked
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
            }`}
          >
            <span
              className={`flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-all ${
                checked
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                  : "border-[var(--color-border)] group-hover:border-[var(--color-accent)]"
              }`}
            >
              {checked && (
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(deck.id)}
              className="sr-only"
            />
            <span className="flex-1 font-semibold">{deck.name}</span>
            <span className="text-xs font-medium text-gray-400">
              {deck.questions.length} domande
            </span>
          </label>
        );
      })}
    </div>
  );
}
