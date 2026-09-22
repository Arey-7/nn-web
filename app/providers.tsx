"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

/**
 * Runs before first paint, from the document head, so the page never flashes
 * the wrong theme. next-themes did this by rendering a <script> inside a
 * component, which React 19 warns about — scripts rendered on the client are
 * never executed.
 */
export const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');t=t==='light'?'light':'dark';document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}`;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

const apply = (t: Theme) => {
  const el = document.documentElement;
  el.classList.toggle("dark", t === "dark");
  el.classList.toggle("light", t === "light");
};

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  // React owns <html className> for the font variables, so hydration wipes the
  // class the head script added. Read the stored choice and re-assert it.
  useEffect(() => {
    let stored: Theme = "dark";
    try {
      stored = localStorage.getItem("theme") === "light" ? "light" : "dark";
    } catch {
      // Private browsing — fall back to the default.
    }
    setThemeState(stored);
    apply(stored);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    apply(t);
    try {
      localStorage.setItem("theme", t);
    } catch {
      // Private browsing — the choice just will not persist.
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
