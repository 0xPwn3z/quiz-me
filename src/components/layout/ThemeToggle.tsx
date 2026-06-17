import { useApp } from "../../context/AppContext";

export function ThemeToggle() {
  const { theme, cycleTheme } = useApp();
  const label =
    theme === "auto" ? "Auto" : theme === "dark" ? "Scuro" : "Chiaro";

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Tema: ${label}`}
      title={`Tema: ${label}`}
    >
      {theme === "auto" ? "💻" : theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
