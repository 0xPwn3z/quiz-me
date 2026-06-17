import { useState, useRef, useCallback } from "react";
import { parseImport } from "../../services/importParser";
import type { ImportPayload } from "../../types";
import { Card } from "../ui/Card";

const PROMPT_TEXT = `RUOLO

Sei un esperto di scienze dell'apprendimento e progettazione di quiz avanzati.

Devi generare un dataset di domande a scelta multipla ad alta qualità didattica.

VINCOLO FONDAMENTALE

Usa ESCLUSIVAMENTE le informazioni contenute nelle fonti fornite.

NON usare conoscenze esterne.

FASE 1 — Analisi del materiale (OUTPUT INTERNO, NON MOSTRARE)

Prima di generare domande:
• Identifica i concetti chiave del materiale.
• Per ogni concetto analizza: importanza, possibili misconcezioni, confusione con altri concetti, applicazioni pratiche.

👉 Questa fase è solo interna. NON deve apparire nell'output.

FASE 2 — Progettazione domande (OUTPUT FINALE)

Genera domande che massimizzano:
• retrieval practice
• comprensione profonda
• discriminazione tra concetti simili
• applicazione pratica

Regole delle domande

Ogni domanda deve:
• testare UNA sola idea
• essere chiara e non ambigua
• richiedere comprensione, non solo memoria
• essere difficile da risolvere senza il materiale

Evita:
• definizioni banali
• trivia
• domande per esclusione
• citazioni letterali

Regole risposte
• esattamente 4 opzioni (sempre)
• una sola corretta
• distrattori plausibili basati su errori reali
• stessa lunghezza e stile tra opzioni
• nessun indizio grammaticale

OUTPUT OBBLIGATORIO (IMPORTANTISSIMO)

Restituisci SOLO un JSON valido compatibile con questa struttura:

[
  {
    "id": "q0001",
    "q": "Testo domanda",
    "c": ["A", "B", "C", "D"],
    "a": 0
  }
]

REGOLE OUTPUT
• SOLO JSON
• NESSUN testo prima o dopo
• NESSUNA spiegazione
• NESSUN markdown
• array JSON valido
• chiavi obbligatorie: id, q, c, a
• a deve essere indice 0–3

Qualità didattica (controllo interno obbligatorio)

Prima di generare ogni domanda verifica:
• richiede comprensione reale?
• un utente superficiale può sbagliare?
• distrattori plausibili?
• risposta corretta unica e inequivocabile?
• non risolvibile per intuito?

Se una risposta fallisce → riscriverla.

SCHEMA DI OUTPUT

[
  {
    "id": "q0001",
    "q": "...",
    "c": ["...", "...", "...", "..."],
    "a": 0
  }
]

NUMERO DOMANDE

30

FINE ISTRUZIONI`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback per contesti non sicuri
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="btn btn-secondary absolute right-2 top-2 px-2.5 py-1 text-xs"
      aria-label="Copia prompt"
    >
      {copied ? "Copiato!" : "Copia"}
    </button>
  );
}

interface ImportSectionProps {
  onImport: (parsed: ImportPayload, name: string) => void;
}

export function ImportSection({ onImport }: ImportSectionProps) {
  const [name, setName] = useState("");
  const [pending, setPending] = useState<ImportPayload | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function parse(text: string) {
    try {
      const parsed = parseImport(text);
      const count = parsed.decks
        ? Object.values(parsed.decks).reduce((s, d) => s + d.questions.length, 0)
        : parsed.questions.length;
      setPending(parsed);
      setError("");
      setSuccess(`Parser riuscito: ${count} domande. ${parsed.decks ? "Backup rilevato." : "Inserisci un nome e salva."}`);
    } catch (e: any) {
      setPending(null);
      setSuccess("");
      setError(e.message || String(e));
    }
  }

  async function handleFile(file: File) {
    if (!file) return;
    const text = await file.text();
    parse(text);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSave() {
    setError("");
    setSuccess("");
    let data = pending;
    if (!data && pasteText.trim()) {
      try {
        data = parseImport(pasteText.trim());
      } catch (e: any) {
        setError(e.message || String(e));
        return;
      }
    }
    if (!data) {
      setError("Nessun dato importato. Carica un file o incolla del testo JSON.");
      return;
    }
    const isBackup = !!data.decks;
    if (!isBackup && !name.trim()) {
      setError("Inserisci un nome per il mazzo.");
      return;
    }
    onImport(data, isBackup ? "" : name.trim());
    setName("");
    setPasteText("");
    setPending(null);
    setSuccess(isBackup ? `Backup importato!` : `Mazzo "${name.trim()}" importato!`);
  }

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Importa un mazzo</h2>
      <label className="mb-1 block text-sm font-bold">Nome del mazzo</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="es. Geografia, Matematica…"
        className="text-input mb-4"
        aria-label="Nome del mazzo da importare"
      />

      <p className="mb-3 text-sm text-gray-400">
        Carica un file JSON o incolla del testo.
      </p>

      <div
        ref={dropRef}
        role="button"
        tabIndex={0}
        aria-label="Trascina qui un file JSON da importare"
        className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center text-gray-400 transition-colors ${
          dragOver
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/4"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
      >
        <span className="text-3xl" aria-hidden="true">📁</span>
        <span>Trascina qui un file JSON o clicca per sceglierlo</span>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Seleziona file JSON"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </div>

      <details open={pasteOpen} onToggle={(e) => setPasteOpen((e.target as HTMLDetailsElement).open)} className="mt-3">
        <summary className="cursor-pointer font-semibold text-[var(--color-accent)]">
          Incolla JSON
        </summary>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={'[{"id":"q1","q":"...","c":["..."],"a":0}]'}
          spellCheck={false}
          className="text-input mt-2 min-h-[8rem] font-mono text-sm"
          aria-label="Area per incollare il JSON"
        />
      </details>

      <button onClick={handleSave} className="btn btn-primary mt-4">
        Salva mazzo
      </button>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold text-gray-400 hover:text-[var(--color-accent)]">
          Prompt per generare domande
        </summary>
        <div className="relative mt-2">
          <textarea
            readOnly
            value={PROMPT_TEXT}
            className="text-input min-h-[10rem] font-mono text-xs leading-relaxed"
            aria-label="Prompt per generare domande JSON"
          />
          <CopyButton text={PROMPT_TEXT} />
        </div>
      </details>

      {error && (
        <div role="alert" className="mt-3 rounded-lg bg-[var(--color-error-bg)] p-3 font-semibold text-[var(--color-error)]">
          {error}
        </div>
      )}
      {success && !error && (
        <div role="status" className="mt-3 rounded-lg bg-[var(--color-success-bg)] p-3 font-semibold text-[var(--color-success)]">
          {success}
        </div>
      )}
    </Card>
  );
}
