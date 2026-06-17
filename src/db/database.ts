import Dexie, { type EntityTable } from "dexie";
import type { StoredDeck, QuestionStats, GlobalStats } from "../types";

class QuizMeDB extends Dexie {
  decks!: EntityTable<StoredDeck, "id">;
  questionStats!: EntityTable<QuestionStats, "compositeKey">;
  globalStats!: EntityTable<GlobalStats, "id">;

  constructor() {
    super("QuizMeDB");
    this.version(1).stores({
      decks: "id, importedAt",
      questionStats: "compositeKey, wrong",
      globalStats: "id",
    });
  }
}

export const db = new QuizMeDB();

export async function ensureGlobalStats(): Promise<GlobalStats> {
  let stats = await db.globalStats.get("global");
  if (!stats) {
    stats = {
      id: "global",
      completed: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTimeMs: 0,
      bestScore: 0,
      bestPercent: 0,
      bestTotal: 0,
    };
    await db.globalStats.put(stats);
  }
  return stats;
}

export async function recordAnswer(
  deckId: string,
  questionId: string,
  qText: string,
  isCorrect: boolean,
) {
  const compositeKey = `${deckId}:${questionId}`;
  await db.transaction("rw", db.questionStats, async () => {
    const existing = await db.questionStats.get(compositeKey);
    if (existing) {
      await db.questionStats.update(compositeKey, {
        attempts: existing.attempts + 1,
        correct: existing.correct + (isCorrect ? 1 : 0),
        wrong: existing.wrong + (isCorrect ? 0 : 1),
        q: qText,
      });
    } else {
      await db.questionStats.put({
        compositeKey,
        deckId,
        questionId,
        q: qText,
        attempts: 1,
        correct: isCorrect ? 1 : 0,
        wrong: isCorrect ? 0 : 1,
      });
    }
  });
}

export function getStatsKey(deckId: string, questionId: string) {
  return `${deckId}:${questionId}`;
}
