"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    try {
      const stored = (localStorage.getItem("theme") as "light" | "dark" | null) || null;
      const initial = stored ?? "dark";
      document.documentElement.setAttribute("data-theme", initial);
      setTheme(initial);
    } catch {
      setTheme("light");
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  }

  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
      🌓
    </button>
  );
}



