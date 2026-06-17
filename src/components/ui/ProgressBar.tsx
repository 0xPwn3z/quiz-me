interface ProgressBarProps {
  value: number; // 0..100
  label?: string;
}

export function ProgressBar({ value, label = "Progresso" }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
    >
      <div
        className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
