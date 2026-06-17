import type { GlobalStats } from "../../types";
import { Card } from "../ui/Card";

interface GlobalStatsMiniProps {
  stats: GlobalStats;
}

function fmtPct(v: number) {
  return v.toFixed(1) + "%";
}

export function GlobalStatsMini({ stats }: GlobalStatsMiniProps) {
  const accuracy = stats.totalQuestions
    ? fmtPct((stats.totalCorrect / stats.totalQuestions) * 100)
    : "—";
  const average = stats.completed
    ? (stats.totalCorrect / stats.completed).toFixed(1)
    : "—";
  const best = stats.completed
    ? `${stats.bestScore} (${stats.bestPercent.toFixed(0)}%)`
    : "—";

  const items = [
    { label: "Quiz completati", value: stats.completed, accent: "var(--color-accent)" },
    { label: "Accuracy", value: accuracy, accent: "var(--color-success)" },
    { label: "Media punteggi", value: average, accent: "var(--color-accent-2)" },
    { label: "Miglior punteggio", value: best, accent: "var(--color-accent-3)" },
  ];

  return (
    <Card className="reveal">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19V5m0 14h16M8 16V9m5 7V6m5 10v-4" />
          </svg>
        </span>
        <h3 className="text-lg font-bold">Statistiche globali</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span
              className="absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-10 blur-xl transition-opacity duration-200 group-hover:opacity-25"
              style={{ background: item.accent }}
            />
            <dt className="text-xs font-semibold text-gray-400">{item.label}</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight">
              {item.value}
            </dd>
          </div>
        ))}
      </div>
    </Card>
  );
}
