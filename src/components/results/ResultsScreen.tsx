import { useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Card } from "../ui/Card";
import { CircularProgress } from "../ui/CircularProgress";
import { Confetti } from "./Confetti";
import { useGsapReveal } from "../../hooks/useGsapReveal";
import { useCountUp } from "../../hooks/useCountUp";

interface ResultsScreenProps {
  score: number;
  total: number;
  durationMs: number;
  onRestart: () => void;
}

function formatMs(ms: number) {
  const t = Math.floor(ms / 1000);
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ResultsScreen({ score, total, durationMs, onRestart }: ResultsScreenProps) {
  const { navigate } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);
  useGsapReveal(rootRef, { stagger: 0.1 });

  const wrong = total - score;
  const percent = total > 0 ? (score / total) * 100 : 0;

  const scoreCount = useCountUp(score, true, { duration: 1.2, delay: 0.3 });
  const totalDisplay = useCountUp(total, true, { duration: 1.2, delay: 0.3 });

  const verdict =
    percent >= 90
      ? { title: "Eccellente!", emoji: "🏆", tone: "var(--color-success)" }
      : percent >= 70
        ? { title: "Molto bene!", emoji: "🎯", tone: "var(--color-accent)" }
        : percent >= 50
          ? { title: "Buon lavoro", emoji: "💪", tone: "var(--color-accent-3)" }
          : { title: "Continua così", emoji: "📚", tone: "var(--color-accent-2)" };

  const details = [
    { label: "Corrette", value: score, tone: "var(--color-success)", icon: "M5 12l5 5L20 7" },
    { label: "Sbagliate", value: wrong, tone: "var(--color-error)", icon: "M6 6l12 12M18 6L6 18" },
    { label: "Tempo", value: formatMs(durationMs), tone: "var(--color-accent-3)", icon: "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" },
  ];

  return (
    <>
      <Confetti fire={percent >= 70} />
      <div ref={rootRef} className="flex flex-col gap-6">
        <Card className="reveal overflow-hidden text-center">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: verdict.tone }}
          />
          <div className="relative">
            <span
              className="reveal inline-block text-5xl"
              style={{ animation: "pop-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              {verdict.emoji}
            </span>
            <h2 className="reveal mt-2 font-display text-3xl font-bold sm:text-4xl">
              {verdict.title}
            </h2>

            <div className="reveal my-6 flex justify-center">
              <CircularProgress value={percent} label="accuratezza" />
            </div>

            <div className="reveal font-display text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">{scoreCount.value}</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
              <span>{totalDisplay.value}</span>
            </div>

            <div className="reveal mt-6 grid grid-cols-3 gap-3">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 p-3"
                >
                  <span
                    className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, ${d.tone} 15%, transparent)`, color: d.tone }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d.icon} />
                    </svg>
                  </span>
                  <dt className="text-xs font-semibold text-gray-400">{d.label}</dt>
                  <dd className="font-display text-lg font-extrabold">{d.value}</dd>
                </div>
              ))}
            </div>

            <div className="reveal mt-7 flex flex-col gap-2">
              <button onClick={onRestart} className="btn btn-primary w-full text-base" aria-label="Ricomincia (tasto R)">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
                </svg>
                Ricomincia <span className="text-sm opacity-60">R</span>
              </button>
              <button onClick={() => navigate("home")} className="btn btn-secondary w-full">
                Home
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
