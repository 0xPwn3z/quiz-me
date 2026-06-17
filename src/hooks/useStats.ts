import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { db, ensureGlobalStats } from "../db/database";
import type { GlobalStats, QuestionStats } from "../types";

const DEFAULT_STATS: GlobalStats = {
  id: "global",
  completed: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  totalTimeMs: 0,
  bestScore: 0,
  bestPercent: 0,
  bestTotal: 0,
};

export function useStats() {
  // Ensure the row exists once on mount (outside live query context)
  useEffect(() => {
    ensureGlobalStats();
  }, []);

  const stats = useLiveQuery(() => db.globalStats.get("global"), []) ?? DEFAULT_STATS;

  const questionStats = useLiveQuery(() => db.questionStats.toArray(), []) ?? [];

  const updateStats = useCallback(
    async (total: number, score: number, durationMs: number) => {
      const current = await ensureGlobalStats();
      const percent = total > 0 ? (score / total) * 100 : 0;
      const updated: GlobalStats = {
        ...current,
        completed: current.completed + 1,
        totalQuestions: current.totalQuestions + total,
        totalCorrect: current.totalCorrect + score,
        totalTimeMs: current.totalTimeMs + durationMs,
      };
      if (
        score > current.bestScore ||
        (score === current.bestScore && percent > current.bestPercent)
      ) {
        updated.bestScore = score;
        updated.bestPercent = percent;
        updated.bestTotal = total;
      }
      await db.globalStats.put(updated);
    },
    [],
  );

  const topWrong: QuestionStats[] = questionStats
    .filter((s) => s.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);

  const clearAll = useCallback(async () => {
    await db.transaction("rw", db.decks, db.questionStats, db.globalStats, async () => {
      await db.decks.clear();
      await db.questionStats.clear();
      await db.globalStats.clear();
    });
    await ensureGlobalStats();
  }, []);

  const restoreStats = useCallback(async (s: GlobalStats) => {
    await db.globalStats.put(s);
  }, []);

  const restoreQuestionStats = useCallback(async (qs: QuestionStats[]) => {
    await db.transaction("rw", db.questionStats, async () => {
      await db.questionStats.clear();
      for (const item of qs) {
        await db.questionStats.put(item);
      }
    });
  }, []);

  return { stats, questionStats, topWrong, updateStats, clearAll, restoreStats, restoreQuestionStats };
}
