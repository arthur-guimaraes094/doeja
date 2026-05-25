import { useState, useEffect } from "react";

export type Theme = "theme-organic" | "theme-retro";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("theme-organic");

  // Load theme from localStorage on client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("doeja-theme") as Theme | null;
    if (savedTheme === "theme-organic" || savedTheme === "theme-retro") {
      const handle = requestAnimationFrame(() => {
        setTheme(savedTheme);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  // Update html class and localStorage whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "theme-organic") {
      root.classList.add("theme-organic");
      root.classList.remove("theme-retro");
    } else {
      root.classList.add("theme-retro");
      root.classList.remove("theme-organic");
    }
    localStorage.setItem("doeja-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "theme-organic" ? "theme-retro" : "theme-organic"));
  };

  return { theme, toggleTheme };
}
