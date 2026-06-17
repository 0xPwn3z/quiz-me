import { useState, useCallback, useMemo, useRef } from "react";
import { useDecks } from "../../hooks/useDecks";
import { useStats } from "../../hooks/useStats";
import { DeckSelector } from "./DeckSelector";
import { ModeSelector } from "./ModeSelector";
import { CountSelector } from "./CountSelector";
import { GlobalStatsMini } from "./GlobalStatsMini";
import { Card } from "../ui/Card";
import { useGsapReveal } from "../../hooks/useGsapReveal";
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
  const rootRef = useRef<HTMLDivElement>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(decks.map((d) => d.id)),
  );
  const [mode, setMode] = useState<QuizMode>("standard");
  const [count, setCount] = useState<number | null>(null);
  const [warning, setWarning] = useState("");

  useGsapReveal(rootRef, { stagger: 0.09 });

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
    () => decks.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [decks],
  );

  const totalQuestions = useMemo(
    () =>
      sortedDecks
        .filter((d) => selectedIds.has(d.id))
        .reduce((s, d) => s + d.questions.length, 0),
    [sortedDecks, selectedIds],
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      {/* Hero */}
      <div className="reveal px-1 pt-2 text-center sm:pt-4">
        <span className="glass-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-success)]" />
          Pronto a imparare
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          Allenati con quiz che <span className="text-gradient">rimangono in testa</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-base text-gray-500 dark:text-gray-400">
          Scegli i mazzi, la modalità e mettiti alla prova. Tracking degli errori in tempo reale.
        </p>
      </div>

      <Card className="reveal">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Nuovo quiz</h2>
          {totalQuestions > 0 && (
            <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
              {totalQuestions} domande
            </span>
          )}
        </div>

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
          <div
            role="status"
            className="mb-4 rounded-xl bg-[var(--color-warning-bg)] p-3 font-semibold text-[var(--color-warning)]"
          >
            {warning}
          </div>
        )}

        <button
          onClick={handleStart}
          className="btn btn-primary w-full text-base"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
          Inizia il quiz
        </button>
      </Card>

      <GlobalStatsMini stats={stats} />
    </div>
  );
}
