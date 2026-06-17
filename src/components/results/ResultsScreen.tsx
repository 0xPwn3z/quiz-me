import { useApp } from "../../context/AppContext";
import { Card } from "../ui/Card";

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
  const wrong = total - score;
  const percent = total > 0 ? (score / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <Card className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Quiz terminato!</h2>
        <div className="mb-2 text-5xl font-extrabold" aria-label="Punteggio">
          {score} / {total}
        </div>
        <div className="mb-6 text-xl font-bold text-[var(--color-accent)]">
          {percent.toFixed(1)}%
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="text-sm text-gray-400">Corrette</dt>
            <dd className="text-lg font-extrabold">{score}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Sbagliate</dt>
            <dd className="text-lg font-extrabold">{wrong}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-400">Tempo</dt>
            <dd className="text-lg font-extrabold">{formatMs(durationMs)}</dd>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={onRestart} className="btn btn-primary w-full" aria-label="Ricomincia (tasto R)">
            Ricomincia <span className="text-sm opacity-60">R</span>
          </button>
          <button onClick={() => navigate("home")} className="btn btn-secondary w-full">
            Home
          </button>
        </div>
      </Card>
    </div>
  );
}
