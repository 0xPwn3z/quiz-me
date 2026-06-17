import { useApp } from "../../context/AppContext";

export function ThemeToggle() {
  const { theme, cycleTheme } = useApp();
  const label = theme === "auto" ? "Auto" : theme === "dark" ? "Scuro" : "Chiaro";

  return (
    <button
      onClick={cycleTheme}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/60 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--color-accent)]"
      aria-label={`Tema: ${label}. Clicca per cambiare.`}
      title={`Tema: ${label}`}
    >
      <span
        key={theme}
        className="absolute inset-0 flex items-center justify-center text-lg"
        style={{ animation: "pop-in 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {theme === "auto" ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        ) : theme === "dark" ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}
      </span>
    </button>
  );
}
