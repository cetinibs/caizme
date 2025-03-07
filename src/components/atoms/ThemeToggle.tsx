"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      {theme === "light" ? (
        <FiMoon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <FiSun className="h-5 w-5 text-gray-200 dark:text-gray-200" />
      )}
    </button>
  );
}
