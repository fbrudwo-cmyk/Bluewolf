"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type React from "react";
import { copy, type Locale } from "@/lib/bluewolf-data";
import { buildHeaderNav } from "@/lib/header-nav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTheme } from "@/app/theme";

export type PageKey = "home" | "about" | "tours" | "booking" | "community" | "faq" | "contact";

type CopyValue = (typeof copy)[Locale];

type PageContextValue = {
    lang: Locale;
    isDark: boolean;
    t: CopyValue;
};

const PageContext = createContext<PageContextValue>({
    lang: "ko",
    isDark: false,
    t: copy.ko,
});

export function usePage() {
    return useContext(PageContext);
}

export function PageShell({
    activeKey,
    children,
}: {
    activeKey: PageKey;
    children: React.ReactNode;
}) {
    const { isDark } = useTheme();
    const [lang, setLang] = useState<Locale>("ko");
    const t = copy[lang];

    const navItems = useMemo(
        () => buildHeaderNav({ locale: lang, t }),
        [lang, t]
    );

    return (
        <PageContext.Provider value={{ lang, isDark, t }}>
            <div
                className={`min-h-screen [font-family:var(--font-noto-sans-cjk),sans-serif] transition-colors duration-300 ${
                    isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
                }`}
            >
                <SiteHeader
                    brand={t.brand}
                    navItems={navItems}
                    activeKey={activeKey}
                    loginLabel={t.login}
                    isDark={isDark}
                    rightSlot={
                        <LanguageSwitcher
                            currentLocale={lang}
                            isDark={isDark}
                            mode="button"
                            onChange={setLang}
                        />
                    }
                />

                <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-6 lg:gap-6">
                    {children}
                </main>

                <SiteFooter brand={t.brand} description={t.footer} isDark={isDark} />
            </div>
        </PageContext.Provider>
    );
}
