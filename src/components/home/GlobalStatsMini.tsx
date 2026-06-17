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
    { label: "Quiz completati", value: stats.completed },
    { label: "Accuracy totale", value: accuracy === "—" ? "—" : accuracy },
    { label: "Media punteggi", value: average === "—" ? "—" : average },
    { label: "Miglior punteggio", value: best },
  ];

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Statistiche globali</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-[var(--color-border)] bg-gray-50 p-3 dark:bg-gray-800/50"
          >
            <dt className="text-xs font-semibold text-gray-400">{item.label}</dt>
            <dd className="mt-1 text-xl font-extrabold">{item.value}</dd>
          </div>
        ))}
      </div>
    </Card>
  );
}
