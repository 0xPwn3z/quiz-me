import type { ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { SkipLink } from "./SkipLink";
import { ThemeToggle } from "./ThemeToggle";
import type { Screen } from "../../types";

const navItems: { screen: Screen; label: string }[] = [
  { screen: "home", label: "Quiz" },
  { screen: "stats", label: "Stats" },
  { screen: "data", label: "Dati" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { screen: currentScreen, navigate } = useApp();

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur-sm dark:bg-gray-950/90">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
          <h1 className="text-2xl font-extrabold tracking-tight">QuizMe</h1>
          <nav className="flex gap-1" aria-label="Navigazione principale">
            {navItems.map(({ screen, label }) => (
              <button
                key={screen}
                onClick={() => navigate(screen)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                  currentScreen === screen
                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label={label}
                aria-current={currentScreen === screen ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-[var(--color-border)] py-5 text-center text-sm text-gray-400 dark:text-gray-500">
        QuizMe — app pensata per esercitarsi con i quiz.
      </footer>
    </div>
  );
}
