import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("vite-ui-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    localStorage.setItem("vite-ui-theme", isDarkMode ? "dark" : "light");

    const navBarColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-nav-bar")
      .trim();

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", navBarColor);
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode((current) => !current)}
      aria-label={isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"}
      className="
        group relative inline-flex size-10 items-center justify-center
        overflow-hidden rounded-xl
        border border-neutral/15
        bg-primary/5
        shadow-sm
        transition-all duration-200 ease-out
        hover:scale-105 hover:bg-secondary/10 hover:shadow-md
        active:scale-95
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-secondary
      "
    >
      <span
        className={`
          absolute inset-0 rounded-xl bg-secondary/10
          transition-transform duration-300
          ${isDarkMode ? "scale-100" : "scale-0"}
        `}
      />

      {isDarkMode ? (
        <Sun
          className="
            relative size-5 text-tertiary
            transition-transform duration-300
            group-hover:rotate-45
          "
        />
      ) : (
        <Moon
          className="
            relative size-5 text-tertiary
            transition-transform duration-300
            group-hover:-rotate-12
          "
        />
      )}
    </button>
  );
}
