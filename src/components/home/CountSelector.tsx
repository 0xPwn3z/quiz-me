import { RadioCard } from "../ui/RadioCard";

interface CountSelectorProps {
  count: number | null;
  onChange: (count: number | null) => void;
}

const counts: { value: string; label: string }[] = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "all", label: "Tutte" },
];

export function CountSelector({ count, onChange }: CountSelectorProps) {
  const currentValue = count === null ? "all" : String(count);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {counts.map((c) => (
        <RadioCard
          key={c.value}
          name="count"
          value={c.value}
          checked={currentValue === c.value}
          onChange={(v) => onChange(v === "all" ? null : parseInt(v, 10))}
          label={c.label}
          id={`count-${c.value}`}
        />
      ))}
    </div>
  );
}
