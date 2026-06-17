import { RadioCard } from "../ui/RadioCard";
import type { QuizMode } from "../../types";

interface ModeSelectorProps {
  mode: QuizMode;
  onChange: (mode: QuizMode) => void;
}

const modes: { value: QuizMode; label: string; desc: string }[] = [
  { value: "standard", label: "Tutti i quiz", desc: "Tutte le domande in ordine casuale" },
  { value: "errors", label: "Solo errori", desc: "Solo le domande sbagliate in passato" },
  { value: "weak", label: "Punti deboli", desc: "Le domande con più errori per prime" },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {modes.map((m) => (
        <RadioCard
          key={m.value}
          name="mode"
          value={m.value}
          checked={mode === m.value}
          onChange={(v) => onChange(v as QuizMode)}
          label={m.label}
          description={m.desc}
          id={`mode-${m.value}`}
        />
      ))}
    </div>
  );
}
