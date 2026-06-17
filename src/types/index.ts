export interface Question {
  id: string;
  q: string;
  c: string[];
  a: number;
  explanation?: string;
  tags?: string[];
  difficulty?: number;
}

export interface StoredDeck {
  id: string;
  name: string;
  questions: Question[];
  importedAt: string;
}

export interface GlobalStats {
  id: "global";
  completed: number;
  totalQuestions: number;
  totalCorrect: number;
  totalTimeMs: number;
  bestScore: number;
  bestPercent: number;
  bestTotal: number;
}

export interface QuestionStats {
  compositeKey: string;
  deckId: string;
  questionId: string;
  q: string;
  attempts: number;
  correct: number;
  wrong: number;
}

export interface SessionItem {
  question: Question;
  deckId: string;
  choices: string[];
  shuffledSourceIndices: number[];
  correctChoiceIndex: number;
  answered: boolean;
  selected?: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctIndex: number;
  selectedIndex: number;
}

export type Screen = "loading" | "home" | "quiz" | "results" | "stats" | "data";

export type QuizMode = "standard" | "errors" | "weak";

export type Theme = "auto" | "light" | "dark";

export type Settings = {
  theme: Theme;
};

export interface ImportPayload {
  questions: Question[];
  progress?: { stats?: GlobalStats; questionStats?: Record<string, QuestionStats> };
  settings?: Settings;
  decks?: Record<string, StoredDeck>;
}
