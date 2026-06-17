
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
      className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors ${
        checked
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
      }`}
    >
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
        <small className="text-sm text-gray-500 dark:text-gray-400">{description}</small>
      )}
    </label>
  );
}
