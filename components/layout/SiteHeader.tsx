"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/app/ThemeToggle";

type HeaderNavItem = {
    key: string;
    href: string;
    label: string;
};

type MovingStyle = {
    left: number;
    top: number;
    width: number;
    height: number;
};

function useSlidingBackground<T extends string>(
    activeKey: T,
    hoverKey: T | null,
    dependencyKey?: string
) {
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

        const frameId = window.requestAnimationFrame(update);

        const container = containerRef.current;
        const target = itemRefs.current[targetKey];

        let resizeObserver: ResizeObserver | null = null;

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                update();
            });

            if (container) resizeObserver.observe(container);
            if (target) resizeObserver.observe(target);
        }

        window.addEventListener("resize", update);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", update);
            resizeObserver?.disconnect();
        };
    }, [targetKey, dependencyKey]);

    return {
        containerRef,
        itemRefs,
        pillStyle,
        targetKey,
    };
}

const actionButtonBase =
    "relative inline-flex h-11 items-center justify-center rounded-2xl border text-sm font-bold transition-[transform,background-color,border-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.96] active:translate-y-0";
const glassButtonLight =
    "border-white/80 bg-transparent text-slate-800 hover:bg-white/20";
const glassButtonDark =
    "border-white/12 bg-transparent text-slate-100 hover:bg-white/15";

const loginButtonClass = `${actionButtonBase} px-4`;
const iconButtonClass = `${actionButtonBase} w-11 min-w-11 px-0`;

const loginOverlay =
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_62%)]";
const loginShine =
    "pointer-events-none absolute inset-y-0 left-[-35%] w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[130%] group-hover:opacity-100";

function MenuIcon({
    open,
    className = "",
}: {
    open: boolean;
    className?: string;
}) {
    return (
        <span className={`relative block h-5 w-5 ${className}`}>
            <svg
                viewBox="0 0 24 24"
                className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "scale-75 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
            </svg>

            <svg
                viewBox="0 0 24 24"
                className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 -rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
            </svg>
        </span>
    );
}

function HeaderNav({
    navItems,
    activeKey,
    isDark,
}: {
    navItems: HeaderNavItem[];
    activeKey: string;
    isDark: boolean;
}) {
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    const navDependencyKey = useMemo(
        () => navItems.map((item) => `${item.key}:${item.label}:${item.href}`).join("|"),
        [navItems]
    );

    const {
        containerRef: navContainerRef,
        itemRefs: navItemRefs,
        pillStyle: navPillStyle,
        targetKey: navTargetKey,
    } = useSlidingBackground(activeKey, hoveredNav, navDependencyKey);

    return (
        <div
            ref={navContainerRef}
            className="relative flex flex-nowrap items-center gap-2"
            onMouseLeave={() => setHoveredNav(null)}
        >
            {navPillStyle && (
                <span
                    className="pointer-events-none absolute rounded-full bg-blue-600 shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition-[left,top,width,height] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={navPillStyle}
                />
            )}

            {navItems.map((item) => {
                const isActive = navTargetKey === item.key;
                const className = `relative z-10 inline-flex shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                        ? "text-white"
                        : isDark
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                }`;

                if (item.href.startsWith("#")) {
                    return (
                        <a
                            key={item.key}
                            href={item.href}
                            className={className}
                            onMouseEnter={() => setHoveredNav(item.key)}
                            ref={(el) => {
                                navItemRefs.current[item.key] = el;
                            }}
                        >
                            {item.label}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={className}
                        onMouseEnter={() => setHoveredNav(item.key)}
                        ref={(el) => {
                            navItemRefs.current[item.key] = el;
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}

export function SiteHeader({
    brand,
    navItems,
    activeKey,
    loginLabel,
    isDark,
    rightSlot,
}: {
    brand: string;
    navItems: HeaderNavItem[];
    activeKey: string;
    loginLabel: string;
    isDark: boolean;
    rightSlot?: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const closeOnResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", closeOnResize);
        return () => window.removeEventListener("resize", closeOnResize);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;

        const close = () => setMobileOpen(false);
        window.addEventListener("hashchange", close);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("hashchange", close);
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileOpen]);

    const buttonTone = isDark ? glassButtonDark : glassButtonLight;

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-colors duration-300 ${
                    isDark
                        ? "border-b border-white/10 bg-slate-950/72 backdrop-blur-xl"
                        : "border-b border-white/60 bg-white/72 backdrop-blur-xl"
                }`}
            >
                <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4 sm:py-4">
                    <div className="relative flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center">
                            <div
                                className={`transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    mobileOpen
                                        ? "pointer-events-none opacity-0 -translate-y-1"
                                        : "opacity-100 translate-y-0"
                                } lg:pointer-events-auto lg:opacity-100 lg:translate-y-0`}
                            >
                                <Link href="/" className="flex min-w-0 items-center gap-3 font-black text-lg sm:text-xl">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg sm:h-11 sm:w-11">
                                        BW
                                    </div>
                                    <span className="truncate">{brand}</span>
                                </Link>
                            </div>

                            <div
                                className={`absolute left-0 flex items-center gap-2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                                    mobileOpen
                                        ? "pointer-events-auto opacity-100 translate-y-0"
                                        : "pointer-events-none opacity-0 -translate-y-1"
                                }`}
                            >
                                <button
                                    className={`group ${loginButtonClass} border-blue-600 bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] active:scale-[0.96] active:shadow-[0_6px_14px_rgba(37,99,235,0.24)]`}
                                >
                                    <span className={loginOverlay} />
                                    <span className={loginShine} />
                                    <span className="relative z-10">{loginLabel}</span>
                                </button>

                                {rightSlot}
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <HeaderNav navItems={navItems} activeKey={activeKey} isDark={isDark} />
                            </div>
                        </div>

                        <div className="hidden flex-1 justify-end lg:flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <ThemeToggle />

                                <button
                                    className={`group ${loginButtonClass} ${
                                        isDark
                                            ? "border-white/10 bg-slate-900 text-slate-100 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                                            : "border-slate-200 bg-white text-slate-800 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                                    }`}
                                >
                                    <span className={loginOverlay} />
                                    <span className={loginShine} />
                                    <span className="relative z-10">{loginLabel}</span>
                                </button>

                                {rightSlot}
                            </div>
                        </div>

                        <div className="flex flex-1 justify-end lg:hidden">
                            <div className="flex items-center gap-2">
                                <ThemeToggle />

                                <button
                                    type="button"
                                    aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
                                    onClick={() => setMobileOpen((prev) => !prev)}
                                    className={`${iconButtonClass} ${buttonTone} shadow-[0_10px_28px_rgba(15,23,42,0.10)]`}
                                >
                                    <MenuIcon open={mobileOpen} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-40 backdrop-blur-md bg-slate-950/24 lg:hidden transition-opacity ease-out ${
                    mobileOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                style={{ transitionDuration: mobileOpen ? "320ms" : "200ms" }}
                aria-hidden="true"
            />

            <div
                className={`fixed inset-x-0 top-[72px] z-50 will-change-transform sm:top-[80px] lg:hidden ${
                    mobileOpen
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                }`}
                style={{
                    transform: mobileOpen ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
                    opacity: mobileOpen ? 1 : 0,
                    transition: mobileOpen
                        ? "transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)"
                        : "transform 220ms cubic-bezier(0.55, 0, 1, 0.45), opacity 180ms ease-in",
                }}
            >
                <div className="mx-auto w-full max-w-7xl">
                    <div className="rounded-b-[28px] px-0 pb-2 pt-3 bg-transparent">
                        <nav className="grid gap-4 px-3 pt-2 sm:px-4">
                            {navItems.map((item, index) => {
                                const isActive = activeKey === item.key;
                                const className = `rounded-[24px] px-5 py-4 text-base font-extrabold backdrop-blur-2xl transition-colors duration-150 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.28)]"
                                        : isDark
                                          ? "border border-white/12 bg-white/8 text-slate-50 shadow-[0_10px_24px_rgba(15,23,42,0.14)] hover:bg-white/12"
                                          : "border border-white/70 bg-white/34 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-white/48"
                                }`;

                                const style = {
                                    transform: mobileOpen ? "translateY(0)" : "translateY(6px)",
                                    opacity: mobileOpen ? 1 : 0,
                                    transition: mobileOpen
                                        ? `transform 400ms cubic-bezier(0.22, 1, 0.36, 1) ${50 + index * 35}ms, opacity 300ms ease-out ${50 + index * 35}ms`
                                        : "transform 150ms ease-in, opacity 120ms ease-in",
                                };

                                if (item.href.startsWith("#")) {
                                    return (
                                        <a
                                            key={item.key}
                                            href={item.href}
                                            className={className}
                                            style={style}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className={className}
                                        style={style}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}