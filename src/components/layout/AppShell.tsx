import type { ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { SkipLink } from "./SkipLink";
import { ThemeToggle } from "./ThemeToggle";
import { AuroraBackground } from "./AuroraBackground";
import type { Screen } from "../../types";

const navItems: { screen: Screen; label: string; icon: string }[] = [
  { screen: "home", label: "Quiz", icon: "M4 12h16M4 6h16M4 18h16" },
  { screen: "stats", label: "Stats", icon: "M4 19V5m0 14h16M8 16V9m5 7V6m5 10v-4" },
  { screen: "data", label: "Dati", icon: "M4 7l8-4 8 4M4 7v10l8 4 8-4V7M4 7l8 4 8-4M12 11v10" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { screen: currentScreen, navigate } = useApp();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <SkipLink />

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/60 backdrop-blur-xl dark:bg-[#07070f]/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:h-20">
          {/* Animated logo */}
          <button
            onClick={() => navigate("home")}
            className="group flex items-center gap-2.5"
            aria-label="QuizMe home"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)] shadow-lg shadow-[var(--color-accent)]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-60" />
              <span className="relative font-display text-lg font-bold text-white">
                Q
              </span>
            </span>
            <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Quiz<span className="text-gradient">Me</span>
            </span>
          </button>

          {/* Glowing nav */}
          <nav className="flex gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/60 p-1 backdrop-blur-md" aria-label="Navigazione principale">
            {navItems.map(({ screen, label, icon }) => {
              const active = currentScreen === screen;
              return (
                <button
                  key={screen}
                  onClick={() => navigate(screen)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-4 ${
                    active
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <span
                      className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] shadow-md shadow-[var(--color-accent)]/40"
                      style={{ animation: "pop-in 0.3s cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  )}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={icon} />
                  </svg>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-[var(--color-border)] py-6 text-center text-sm text-gray-400 dark:text-gray-500">
        <div className="mx-auto max-w-3xl px-4">
          QuizMe — <span className="text-gradient font-semibold">impara ripetendo</span>.
        </div>
      </footer>
    </div>
  );
}
