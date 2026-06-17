import { useState, useCallback, useMemo } from "react";
import { useDecks } from "../../hooks/useDecks";
import { useStats } from "../../hooks/useStats";
import { DeckSelector } from "./DeckSelector";
import { ModeSelector } from "./ModeSelector";
import { CountSelector } from "./CountSelector";
import { GlobalStatsMini } from "./GlobalStatsMini";
import { Card } from "../ui/Card";
import type { QuizMode } from "../../types";

interface HomeScreenProps {
  onStart: (
    selectedDeckIds: string[],
    mode: QuizMode,
    count: number | null,
  ) => boolean;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const { decks } = useDecks();
  const { stats } = useStats();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // default: select all decks
    const allIds = decks.map((d) => d.id);
    return new Set(allIds);
  });
  const [mode, setMode] = useState<QuizMode>("standard");
  const [count, setCount] = useState<number | null>(null); // null = all
  const [warning, setWarning] = useState("");

  const toggleDeck = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setWarning("");
  }, []);

  const handleModeChange = useCallback((m: QuizMode) => {
    setMode(m);
    setWarning("");
  }, []);

  const handleStart = useCallback(() => {
    const ids = [...selectedIds];
    if (ids.length === 0) {
      setWarning("Seleziona almeno un mazzo.");
      return;
    }
    const ok = onStart(ids, mode, count);
    if (!ok) {
      setWarning("Nessuna domanda disponibile per la selezione corrente.");
    }
  }, [selectedIds, mode, count, onStart]);

  const sortedDecks = useMemo(
    () =>
      decks
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [decks],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Nuovo quiz</h2>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-2 font-bold">Seleziona mazzi</legend>
          <DeckSelector
            decks={sortedDecks}
            selectedIds={selectedIds}
            onToggle={toggleDeck}
          />
        </fieldset>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-2 font-bold">Modalità</legend>
          <ModeSelector mode={mode} onChange={handleModeChange} />
        </fieldset>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-2 font-bold">Numero domande</legend>
          <CountSelector count={count} onChange={setCount} />
        </fieldset>

        {warning && (
          <div role="status" className="mb-4 rounded-lg bg-[var(--color-warning-bg)] p-3 font-semibold text-[var(--color-warning)]">
            {warning}
          </div>
        )}

        <button onClick={handleStart} className="btn btn-primary w-full">
          Inizia
        </button>
      </Card>

      <GlobalStatsMini stats={stats} />
    </div>
  );
}
