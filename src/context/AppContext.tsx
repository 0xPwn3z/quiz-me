import { createContext, useContext, type ReactNode } from "react";
import type { Theme, Screen } from "../types";

interface AppContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
  screen: Screen;
  navigate: (s: Screen) => void;
}

export const AppContext = createContext<AppContextValue>(null!);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppContextValue;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
