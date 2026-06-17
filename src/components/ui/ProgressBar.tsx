interface ProgressBarProps {
  value: number; // 0..100
  label?: string;
}

export function ProgressBar({ value, label = "Progresso" }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={label}
      className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
    >
      <div
        className="relative h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${v}%`,
          backgroundImage:
            "linear-gradient(90deg, var(--color-accent), var(--color-accent-2), var(--color-accent-3))",
          boxShadow:
            "0 0 12px color-mix(in srgb, var(--color-accent) 60%, transparent)",
        }}
      >
        <span
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.2s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
