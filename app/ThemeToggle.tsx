"use client";

import { useTheme } from "./theme";

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "라이트모드로 전환" : "다크모드로 전환"}
            className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition-[background-color,border-color,transform] duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.92] active:translate-y-0 ${isDark
                    ? "border-white/10 bg-slate-900 text-yellow-300 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
        >
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_62%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <span
                className={`relative text-xl transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark ? "rotate-0 scale-100" : "rotate-180 scale-90"
                    }`}
            >
                {isDark ? "☾" : "☀"}
            </span>
        </button>
    );
}