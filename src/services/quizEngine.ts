import type {
  Question,
  StoredDeck,
  QuestionStats,
  SessionItem,
  AnswerResult,
  QuizMode,
} from "../types";
import { getStatsKey } from "../db/database";

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function prepareSession(
  decks: Record<string, StoredDeck>,
  selectedDeckIds: string[],
  questionStats: QuestionStats[],
  mode: QuizMode,
  count: number | null,
): SessionItem[] {
  const statsMap = new Map(questionStats.map((s) => [s.compositeKey, s]));

  let pool: { question: Question; deckId: string }[] = [];
  for (const did of selectedDeckIds) {
    const deck = decks[did];
    if (!deck) continue;
    for (const q of deck.questions) {
      pool.push({ question: q, deckId: did });
    }
  }

  if (mode === "errors") {
    pool = pool.filter(
      ({ deckId, question }) =>
        (statsMap.get(getStatsKey(deckId, question.id))?.wrong ?? 0) > 0,
    );
    shuffle(pool);
  } else if (mode === "weak") {
    pool = pool.filter(
      ({ deckId, question }) =>
        (statsMap.get(getStatsKey(deckId, question.id))?.wrong ?? 0) > 0,
    );
    pool.sort((a, b) => {
      const wa = statsMap.get(getStatsKey(a.deckId, a.question.id))?.wrong ?? 0;
      const wb = statsMap.get(getStatsKey(b.deckId, b.question.id))?.wrong ?? 0;
      return wb - wa || Math.random() - 0.5;
    });
  } else {
    shuffle(pool);
  }

  if (count !== null && count > 0 && count < pool.length) {
    pool = pool.slice(0, count);
  }

  return pool.map((entry) => buildItem(entry));
}

function buildItem(entry: { question: Question; deckId: string }): SessionItem {
  const { question, deckId } = entry;
  const src = question.c.map((_, i) => i);
  const shuffled = shuffle(src);
  return {
    question,
    deckId,
    choices: shuffled.map((i) => question.c[i]),
    shuffledSourceIndices: shuffled,
    correctChoiceIndex: shuffled.indexOf(question.a),
    answered: false,
  };
}

export function selectAnswer(item: SessionItem, choiceIndex: number): AnswerResult | null {
  if (item.answered) return null;
  item.answered = true;
  item.selected = choiceIndex;
  const isCorrect = choiceIndex === item.correctChoiceIndex;
  return { isCorrect, correctIndex: item.correctChoiceIndex, selectedIndex: choiceIndex };
}
