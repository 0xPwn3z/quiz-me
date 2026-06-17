import { Card } from "../ui/Card";
import type { GlobalStats, QuestionStats } from "../../types";

interface StatsScreenProps {
  stats: GlobalStats;
  questionStats: QuestionStats[];
}

function formatMs(ms: number) {
  const t = Math.floor(ms / 1000);
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function StatsScreen({ stats, questionStats }: StatsScreenProps) {
  const totalAttempts = questionStats.reduce((s, qs) => s + qs.attempts, 0);
  const totalCorrect = questionStats.reduce((s, qs) => s + qs.correct, 0);
  const accuracy = totalAttempts ? ((totalCorrect / totalAttempts) * 100).toFixed(1) + "%" : "—";
  const average = stats.completed ? (stats.totalCorrect / stats.completed).toFixed(1) : "—";
  const avgTime = stats.completed ? formatMs(stats.totalTimeMs / stats.completed) : "—";
  const best =
    stats.completed
      ? `${stats.bestScore} / ${stats.bestTotal || "?"}`
      : "—";
  const bestPct = stats.completed ? stats.bestPercent.toFixed(1) + "%" : "—";

  const detailItems = [
    { label: "Quiz completati", value: stats.completed },
    { label: "Domande totali affrontate", value: totalAttempts },
    { label: "Risposte corrette totali", value: totalCorrect },
    { label: "Accuracy totale", value: accuracy },
    { label: "Media punteggi", value: average },
    { label: "Tempo medio", value: avgTime },
    { label: "Miglior punteggio", value: best },
    { label: "Miglior percentuale", value: bestPct },
  ];

  const topWrong = questionStats
    .filter((s) => s.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 text-xl font-bold">Statistiche dettagliate</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {detailItems.map((item) => (
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

      <Card>
        <h3 className="mb-3 text-lg font-bold">Top 10 domande più sbagliate</h3>
        {topWrong.length === 0 ? (
          <p className="py-4 text-center text-gray-400">Non hai ancora sbagliato domande. Ottimo lavoro!</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400">Domanda</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400">Errori</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-400">Successo</th>
                </tr>
              </thead>
              <tbody>
                {topWrong.map((s) => {
                  const success = s.attempts > 0 ? ((s.correct / s.attempts) * 100).toFixed(0) + "%" : "—";
                  return (
                    <tr key={s.compositeKey} className="border-t border-[var(--color-border)]">
                      <td className="max-w-xs truncate px-4 py-2.5" title={s.q}>
                        {esc(s.q)}
                      </td>
                      <td className="px-4 py-2.5 font-semibold">{s.wrong}</td>
                      <td className="px-4 py-2.5">{success}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
