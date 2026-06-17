import { useState, useCallback, Component, type ReactNode } from "react";
import { AppProvider } from "./context/AppContext";
import { AppShell } from "./components/layout/AppShell";
import { HomeScreen } from "./components/home/HomeScreen";
import { QuizScreen } from "./components/quiz/QuizScreen";
import { ResultsScreen } from "./components/results/ResultsScreen";
import { StatsScreen } from "./components/stats/StatsScreen";
import { DataScreen } from "./components/data/DataScreen";
import { useTheme } from "./hooks/useTheme";
import { useQuiz } from "./hooks/useQuiz";
import { useDecks } from "./hooks/useDecks";
import { useStats } from "./hooks/useStats";
import type { Screen, QuizMode } from "./types";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-red-300 bg-red-50 p-8 text-center dark:bg-red-950">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Errore</h2>
          <p className="mt-2 font-mono text-sm text-red-600 dark:text-red-300">{this.state.error.message}</p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-red-100 p-3 text-left text-xs dark:bg-red-900">{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [screen, setScreen] = useState<Screen>("home");
  const quiz = useQuiz();
  const { decksById } = useDecks();
  const { stats, questionStats: allQuestionStats, updateStats } = useStats();

  // Quiz results stored for ResultsScreen
  const [results, setResults] = useState<{
    score: number;
    total: number;
    durationMs: number;
  } | null>(null);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    setResults(null);
  }, []);

  const handleStart = useCallback(
    (selectedDeckIds: string[], mode: QuizMode, count: number | null) => {
      const len = quiz.startQuiz(decksById, selectedDeckIds, allQuestionStats, mode, count);
      if (len > 0) {
        setResults(null);
        setScreen("quiz");
      }
      return len > 0;
    },
    [quiz, decksById, allQuestionStats],
  );

  const handleQuizFinish = useCallback(
    (score: number, total: number, durationMs: number, mode: QuizMode) => {
      // Solo la modalità "standard" aggiorna le statistiche globali
      if (mode === "standard") {
        updateStats(total, score, durationMs);
      }
      setResults({ score, total, durationMs });
      setScreen("results");
    },
    [updateStats],
  );

  const handleRestart = useCallback(() => {
    // Go back to home - user can click start again
    setScreen("home");
    setResults(null);
  }, []);

  const contextValue = {
    theme,
    setTheme,
    cycleTheme,
    screen,
    navigate,
  };

  return (
    <AppProvider value={contextValue}>
      <ErrorBoundary>
        <AppShell>
          {screen === "home" && <HomeScreen onStart={handleStart} />}
          {screen === "quiz" && <QuizScreen quiz={quiz} onFinish={handleQuizFinish} />}
          {screen === "results" && results && (
            <ResultsScreen
              score={results.score}
              total={results.total}
              durationMs={results.durationMs}
              onRestart={handleRestart}
            />
          )}
          {screen === "stats" && (
            <StatsScreen stats={stats} questionStats={allQuestionStats} />
          )}
          {screen === "data" && <DataScreen />}
        </AppShell>
      </ErrorBoundary>
    </AppProvider>
  );
}
