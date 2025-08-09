"use client";

import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

type HeaderProps = { todoCount: number };

export default function Header({ todoCount }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    setChecked(resolvedTheme === "dark");

    const d = new Date();
    setDateStr(
      d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, [mounted, resolvedTheme]);

  const plural = useMemo(() => (todoCount === 1 ? "" : "s"), [todoCount]);

  return (
    <header
      className="
      relative overflow-hidden rounded-xl sm:rounded-2xl mb-6 sm:mb-8
      bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500
      dark:from-slate-800 dark:via-slate-700 dark:to-slate-700
      text-white p-4 sm:p-6 md:p-8 shadow-2xl
    "
    >
      <div className="hidden sm:block pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="hidden sm:block pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 dark:bg-black/30 blur-3xl" />

      <div
        className="
        relative backdrop-blur-sm bg-white/10 dark:bg-black/20
        rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6
        border border-white/20 dark:border-white/10
      "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1
              className="
              text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight
              bg-gradient-to-r from-white to-gray-200 dark:from-gray-100 dark:to-gray-300
              bg-clip-text text-transparent
            "
            >
              My Todos
            </h1>

            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/90 dark:text-gray-200 leading-relaxed">
              <span className="inline-block sm:inline rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium sm:mr-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                {mounted ? dateStr : "— — —"}
              </span>
              <span className="block sm:inline font-semibold mt-1 sm:mt-0">
                You have{" "}
                <span
                  className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mx-1 text-xs sm:text-sm font-bold bg-white dark:bg-gray-100 text-blue-600 dark:text-slate-800"
                  aria-live="polite"
                >
                  {todoCount}
                </span>
                todo{plural}
              </span>
            </p>
          </div>

          <div className="mt-1 sm:mt-0 flex flex-wrap items-center gap-2 sm:gap-3">
            <IconButton
              label="Switch to light theme"
              onClick={() => setTheme("light")}
              ariaPressed={mounted ? resolvedTheme === "light" : undefined}
              className="h-10 w-10 sm:h-10 sm:w-10"
            >
              <Sun className="h-5 w-5" />
            </IconButton>

            <Switch
              id="theme-switch"
              checked={mounted ? checked : false}
              onCheckedChange={(value) => {
                setChecked(value);
                setTheme(value ? "dark" : "light");
              }}
              className="data-[state=checked]:bg-gray-600 transition-colors duration-300"
              aria-label="Toggle dark mode"
            />

            <IconButton
              label="Switch to dark theme"
              onClick={() => setTheme("dark")}
              ariaPressed={mounted ? resolvedTheme === "dark" : undefined}
              className="h-10 w-10 sm:h-10 sm:w-10"
            >
              <Moon className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
  onClick,
  ariaPressed,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaPressed?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={ariaPressed}
      className={`
        inline-flex items-center justify-center
        h-10 w-10 rounded-full
        bg-white/20 dark:bg-black/20
        border border-white/20 dark:border-white/10
        hover:bg-white/30 dark:hover:bg-black/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2
        transition-transform duration-200 motion-safe:hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
}

