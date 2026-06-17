import type { Question, ImportPayload } from "../types";

export function validateQuestions(data: unknown): Question[] {
  if (!Array.isArray(data)) {
    throw new Error("Il file deve contenere un array di domande.");
  }
  const errors: string[] = [];
  data.forEach((item, idx) => {
    if (!item || typeof item !== "object") {
      errors.push(`Elemento ${idx}: non è un oggetto.`);
      return;
    }
    if (typeof (item as Question).id !== "string" || !(item as Question).id.trim()) {
      errors.push(`Elemento ${idx}: campo "id" mancante.`);
    }
    if (typeof (item as Question).q !== "string" || !(item as Question).q.trim()) {
      errors.push(`Elemento ${idx} (${(item as Question).id || "?"}): campo "q" mancante.`);
    }
    if (
      !Array.isArray((item as Question).c) ||
      (item as Question).c.length < 2
    ) {
      errors.push(
        `Elemento ${idx} (${(item as Question).id || "?"}): "c" deve avere almeno 2 scelte.`,
      );
    } else if ((item as Question).c.some((ch) => typeof ch !== "string")) {
      errors.push(
        `Elemento ${idx} (${(item as Question).id || "?"}): ogni scelta deve essere una stringa.`,
      );
    }
    if (
      typeof (item as Question).a !== "number" ||
      !Number.isInteger((item as Question).a)
    ) {
      errors.push(`Elemento ${idx} (${(item as Question).id || "?"}): "a" deve essere un intero.`);
    } else if (
      (item as Question).c &&
      ((item as Question).a < 0 || (item as Question).a >= (item as Question).c.length)
    ) {
      errors.push(
        `Elemento ${idx} (${(item as Question).id || "?"}): "a" indice fuori range.`,
      );
    }
  });
  if (errors.length) {
    const e = new Error(errors.join("\n"));
    e.name = "ValidationError";
    throw e;
  }
  return data as Question[];
}

export function parseImport(rawText: string): ImportPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Il file non è un JSON valido.");
  }

  let questions: Question[] | null = null;
  let progress = undefined;
  let settings = undefined;
  let decks = undefined;

  if (Array.isArray(parsed)) {
    questions = parsed;
  } else if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.questions)) questions = obj.questions as Question[];
    if (obj.decks) decks = obj.decks as ImportPayload["decks"];
    if (obj.progress) progress = obj.progress as ImportPayload["progress"];
    if (obj.settings) settings = obj.settings as ImportPayload["settings"];
  }

  if (!questions && !decks) {
    throw new Error(
      'Struttura non riconosciuta: serve un array di domande o un oggetto con "questions" o "decks".',
    );
  }

  if (questions) validateQuestions(questions);
  if (decks) {
    for (const d of Object.values(decks)) {
      if (!d.id || !d.name || !Array.isArray(d.questions)) {
        throw new Error(`Deck invalido: "${d.name || d.id}".`);
      }
      validateQuestions(d.questions);
    }
  }

  return { questions: questions || [], progress, settings, decks };
}
