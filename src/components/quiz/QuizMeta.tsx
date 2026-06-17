import { ProgressBar } from "../ui/ProgressBar";

interface QuizMetaProps {
  current: number;
  total: number;
  score: number;
  percent: number;
  elapsed: string;
}

export function QuizMeta({ current, total, score, percent, elapsed }: QuizMetaProps) {
  const stats = [
    { label: "Domanda", value: `${current} / ${total}`, icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
    { label: "Corrette", value: `${score}`, icon: "M5 12l5 5L20 7", accent: "var(--color-success)" },
    { label: "Tempo", value: elapsed, icon: "M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      <ProgressBar value={percent} />
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-pill flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400"
          >
            <svg
              className="h-4 w-4 flex-none"
              style={s.accent ? { color: s.accent } : undefined}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={s.icon} />
            </svg>
            <span className="truncate" aria-label={s.label}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
