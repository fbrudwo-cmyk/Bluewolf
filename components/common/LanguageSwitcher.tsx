"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

type Locale = "ko" | "ja" | "en";

type MovingStyle = {
    left: number;
    top: number;
    width: number;
    height: number;
};

function useSlidingBackground<T extends string>(activeKey: T, hoverKey: T | null) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Record<string, HTMLElement | null>>({});
    const [pillStyle, setPillStyle] = useState<MovingStyle | null>(null);

    const targetKey = hoverKey ?? activeKey;

    useLayoutEffect(() => {
        const update = () => {
            const container = containerRef.current;
            const target = itemRefs.current[targetKey];
            if (!container || !target) return;

            const containerBox = container.getBoundingClientRect();
            const targetBox = target.getBoundingClientRect();

            setPillStyle({
                left: targetBox.left - containerBox.left,
                top: targetBox.top - containerBox.top,
                width: targetBox.width,
                height: targetBox.height,
            });
        };

        update();
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
        };
    }, [targetKey]);

    return {
        containerRef,
        itemRefs,
        pillStyle,
        targetKey,
    };
}

export function LanguageSwitcher({
    currentLocale,
    isDark,
    mode,
    onChange,
}: {
    currentLocale: Locale;
    isDark: boolean;
    mode: "button" | "link";
    onChange?: (locale: Locale) => void;
}) {
    const [hoveredLang, setHoveredLang] = useState<Locale | null>(null);

    const { containerRef, itemRefs, pillStyle, targetKey } = useSlidingBackground<Locale>(
        currentLocale,
        hoveredLang
    );

    const items: { key: Locale; label: string; href: string }[] = [
        { key: "ko", label: "KO", href: "/about" },
        { key: "ja", label: "JA", href: "/about/ja" },
        { key: "en", label: "EN", href: "/about/en" },
    ];

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex h-11 items-center overflow-hidden rounded-2xl border p-0 transition-colors duration-300 ${
                isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
            }`}
            onMouseLeave={() => setHoveredLang(null)}
        >
            {pillStyle && (
                <span
                    className="pointer-events-none absolute rounded-2xl bg-blue-600 transition-[left,top,width,height] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={pillStyle}
                />
            )}

            {items.map((item) => {
                const isActive = targetKey === item.key;
                const className = `relative z-10 inline-flex h-11 min-w-[46px] items-center justify-center px-3 text-sm font-bold transition-colors duration-200 ${
                    isActive
                        ? "text-white"
                        : isDark
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                }`;

                if (mode === "button") {
                    return (
                        <button
                            key={item.key}
                            type="button"
                            className={className}
                            onClick={() => onChange?.(item.key)}
                            onMouseEnter={() => setHoveredLang(item.key)}
                            ref={(el) => {
                                itemRefs.current[item.key] = el;
                            }}
                        >
                            {item.label}
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={className}
                        onMouseEnter={() => setHoveredLang(item.key)}
                        ref={(el) => {
                            itemRefs.current[item.key] = el;
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}