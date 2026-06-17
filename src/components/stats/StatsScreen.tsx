import { useRef } from "react";
import { Card } from "../ui/Card";
import { useGsapReveal } from "../../hooks/useGsapReveal";
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
  const rootRef = useRef<HTMLDivElement>(null);
  useGsapReveal(rootRef, { stagger: 0.07 });

  const totalAttempts = questionStats.reduce((s, qs) => s + qs.attempts, 0);
  const totalCorrect = questionStats.reduce((s, qs) => s + qs.correct, 0);
  const totalWrong = questionStats.reduce((s, qs) => s + qs.wrong, 0);
  const accuracyPct = totalAttempts ? (totalCorrect / totalAttempts) * 100 : 0;
  const accuracy = totalAttempts ? accuracyPct.toFixed(1) + "%" : "—";
  const average = stats.completed ? (stats.totalCorrect / stats.completed).toFixed(1) : "—";
  const avgTime = stats.completed ? formatMs(stats.totalTimeMs / stats.completed) : "—";
  const best = stats.completed ? `${stats.bestScore} / ${stats.bestTotal || "?"}` : "—";
  const bestPct = stats.completed ? stats.bestPercent.toFixed(1) + "%" : "—";

  const detailItems = [
    { label: "Quiz completati", value: stats.completed, accent: "var(--color-accent)" },
    { label: "Domande affrontate", value: totalAttempts, accent: "var(--color-accent-3)" },
    { label: "Risposte corrette", value: totalCorrect, accent: "var(--color-success)" },
    { label: "Risposte errate", value: totalWrong, accent: "var(--color-error)" },
    { label: "Accuracy totale", value: accuracy, accent: "var(--color-accent-2)" },
    { label: "Media punteggi", value: average, accent: "var(--color-accent)" },
    { label: "Tempo medio", value: avgTime, accent: "var(--color-accent-3)" },
    { label: "Miglior punteggio", value: best, accent: "var(--color-success)" },
  ];

  const topWrong = questionStats
    .filter((s) => s.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);

  const maxWrong = topWrong.length ? topWrong[0].wrong : 1;

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      {/* Accuracy hero */}
      <Card className="reveal overflow-hidden">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Le tue statistiche</h2>
            <p className="mt-1 text-sm text-gray-400">Panoramica dei tuoi progressi di studio</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold tracking-tight text-gradient">
              {totalAttempts ? accuracyPct.toFixed(0) : 0}%
            </span>
            <span className="text-sm font-semibold text-gray-400">accuracy</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {detailItems.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-3.5"
            >
              <span
                className="absolute -right-3 -top-3 h-12 w-12 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-25"
                style={{ background: item.accent }}
              />
              <dt className="text-xs font-semibold text-gray-400">{item.label}</dt>
              <dd className="mt-1 font-display text-xl font-bold tracking-tight">{item.value}</dd>
            </div>
          ))}
        </div>
      </Card>

      {/* Top wrong with animated bars */}
      <Card className="reveal">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-error)]/12 text-[var(--color-error)]">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </span>
          <h3 className="text-lg font-bold">Top 10 domande più sbagliate</h3>
        </div>
        {topWrong.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <span className="text-4xl">🎉</span>
            <p className="font-semibold text-gray-500 dark:text-gray-400">
              Non hai ancora sbagliato domande. Ottimo lavoro!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {topWrong.map((s, i) => {
              const success = s.attempts > 0 ? (s.correct / s.attempts) * 100 : 0;
              const widthPct = (s.wrong / maxWrong) * 100;
              return (
                <div
                  key={s.compositeKey}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/40 p-3 transition-colors hover:border-[var(--color-accent)]/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold" title={s.q}>
                      <span className="mr-2 text-gray-400">{i + 1}.</span>
                      {esc(s.q)}
                    </span>
                    <span className="flex flex-none items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-[var(--color-error)]/15 px-2 py-0.5 text-[var(--color-error)]">
                        {s.wrong} errori
                      </span>
                      <span className="text-gray-400">{success.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${widthPct}%`,
                        backgroundImage: "linear-gradient(90deg, var(--color-accent-2), var(--color-error))",
                        animation: "pop-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
                        animationDelay: `${0.05 * i}s`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {stats.completed > 0 && (
        <Card className="reveal flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Miglior percentuale</div>
            <div className="font-display text-2xl font-bold text-gradient">{bestPct}</div>
          </div>
          <svg className="h-8 w-8 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.18 22 12 17.27 5.82 22l2.36-8.15L2 9.36h7.61L12 2z" />
          </svg>
        </Card>
      )}
    </div>
  );
}
