// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  isDark: true,
});

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {}, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
