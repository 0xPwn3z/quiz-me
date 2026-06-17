import { ProgressBar } from "../ui/ProgressBar";

interface QuizMetaProps {
  current: number;
  total: number;
  score: number;
  percent: number;
  elapsed: string;
}

export function QuizMeta({ current, total, score, percent, elapsed }: QuizMetaProps) {
  return (
    <div className="flex flex-col gap-2">
      <ProgressBar value={percent} />
      <div className="flex justify-between text-sm font-semibold text-gray-400">
        <span aria-label="Domanda corrente">{current} / {total}</span>
        <span aria-label="Punteggio">{score} corrette</span>
        <span aria-label="Tempo trascorso">{elapsed}</span>
      </div>
    </div>
  );
}
