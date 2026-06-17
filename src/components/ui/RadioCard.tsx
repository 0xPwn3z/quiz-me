interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  id: string;
}

export function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  id,
}: RadioCardProps) {
  return (
    <label
      htmlFor={id}
      className={`group relative flex cursor-pointer flex-col gap-1 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
        checked
          ? "border-transparent bg-[var(--color-accent)]/8 shadow-md shadow-[var(--color-accent)]/10"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
      }`}
    >
      {checked && (
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[var(--color-accent)]"
          style={{ animation: "pop-in 0.3s cubic-bezier(0.22,1,0.36,1)" }}
        />
      )}
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="font-semibold">{label}</span>
      {description && (
        <small className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </small>
      )}
    </label>
  );
}
