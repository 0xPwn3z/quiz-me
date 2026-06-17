import { useState, useCallback, useRef } from "react";
import type { SessionItem, AnswerResult, QuizMode } from "../types";
import { prepareSession, selectAnswer as engineSelect } from "../services/quizEngine";
import { recordAnswer } from "../db/database";
import type { StoredDeck, QuestionStats } from "../types";

export interface QuizAPI {
  state: QuizState;
  startQuiz: (
    decksById: Record<string, StoredDeck>,
    selectedDeckIds: string[],
    questionStats: QuestionStats[],
    mode: QuizMode,
    count: number | null,
  ) => number;
  getCurrentItem: () => SessionItem | null;
  answer: (choiceIndex: number) => AnswerResult | null;
  next: () => boolean;
  finish: () => void;
  progress: { current: number; total: number; percent: number };
}

export interface QuizState {
  session: SessionItem[];
  currentIndex: number;
  score: number;
  phase: "active" | "answered" | "finished";
  mode: QuizMode;
}

export function useQuiz(): QuizAPI {
  const [state, setState] = useState<QuizState>({
    session: [],
    currentIndex: 0,
    score: 0,
    phase: "finished",
    mode: "standard",
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const startQuiz = useCallback(
    (
      decksById: Record<string, StoredDeck>,
      selectedDeckIds: string[],
      questionStats: QuestionStats[],
      mode: QuizMode,
      count: number | null,
    ) => {
      const session = prepareSession(decksById, selectedDeckIds, questionStats, mode, count);
      setState({ session, currentIndex: 0, score: 0, phase: "active", mode });
      return session.length;
    },
    [],
  );

  const getCurrentItem = useCallback((): SessionItem | null => {
    const s = stateRef.current;
    return s.session[s.currentIndex] ?? null;
  }, []);

  const answer = useCallback(
    (choiceIndex: number): AnswerResult | null => {
      const s = stateRef.current;
      const item = s.session[s.currentIndex];
      if (!item || item.answered) return null;
      const result = engineSelect(item, choiceIndex);
      if (!result) return null;

      const newScore = s.score + (result.isCorrect ? 1 : 0);
      const newSession = [...s.session];
      newSession[s.currentIndex] = { ...item };

      recordAnswer(
        item.deckId,
        item.question.id,
        item.question.q,
        result.isCorrect,
      );

      setState({
        ...s,
        session: newSession,
        score: newScore,
        phase: "answered",
      });
      return result;
    },
    [],
  );

  const next = useCallback((): boolean => {
    const s = stateRef.current;
    if (s.phase === "finished") return false;
    if (s.currentIndex >= s.session.length - 1) {
      setState({ ...s, phase: "finished" });
      return false;
    }
    setState({ ...s, currentIndex: s.currentIndex + 1, phase: "active" });
    return true;
  }, []);

  const finish = useCallback(() => {
    setState((s) => ({ ...s, phase: "finished" }));
  }, []);

  const progress = {
    current: state.session.length > 0 ? state.currentIndex + 1 : 0,
    total: state.session.length,
    percent:
      state.session.length > 0
        ? ((state.currentIndex + (state.phase === "answered" ? 1 : 0)) / state.session.length) * 100
        : 0,
  };

  return {
    state,
    startQuiz,
    getCurrentItem,
    answer,
    next,
    finish,
    progress,
  };
}
