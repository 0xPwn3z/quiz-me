import type { Settings } from "../types";

const SETTINGS_KEY = "quizme_settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { theme: "auto" };
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
}

export function clearAllStorage() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch { /* ignore */ }
}
