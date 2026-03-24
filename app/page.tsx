"use client";

import { useEffect, useMemo, useState } from "react";
import {
    community,
    copy,
    faq,
    publishingSteps,
    slides,
    tours,
    type CommunityTab,
    type Locale,
} from "@/lib/bluewolf-data";
import { filterTours } from "@/lib/bluewolf-utils";
import { buildHeaderNav } from "@/lib/header-nav";
import { HeroSection } from "@/components/sections/HeroSection";
import { PublishingSection } from "@/components/sections/PublishingSection";
import { PromoBannerSection } from "@/components/sections/PromoBannerSection";
import { ToursSection } from "@/components/sections/ToursSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTheme } from "./theme";

export default function Page() {
    const { isDark } = useTheme();

    const [lang, setLang] = useState<Locale>("ko");
    const [keyword, setKeyword] = useState("");
    const [duration, setDuration] = useState("all");
    const [region, setRegion] = useState("all");
    const [theme, setTheme] = useState("all");
    const [sort, setSort] = useState("popular");
    const [selectedTourId, setSelectedTourId] = useState(1);
    const [departDate, setDepartDate] = useState("");
    const [guestCount, setGuestCount] = useState(2);
    const [communityTab, setCommunityTab] = useState<CommunityTab>("all");
    const [paymentDone, setPaymentDone] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const t = copy[lang];
    const hero = slides[lang];
    const currentSlide = hero[slideIndex % hero.length];

    const navItems = useMemo(
        () =>
            buildHeaderNav({
                locale: lang,
                pageType: "home",
                t,
            }),
        [lang, t]
    );

    const filteredTours = useMemo(
        () => filterTours(tours, lang, keyword, duration, region, theme, sort),
        [duration, keyword, lang, region, sort, theme]
    );

    const selectedTour = tours.find((tour) => tour.id === selectedTourId) ?? tours[0];
    const totalPrice = selectedTour.price * guestCount;
    const depositPrice = selectedTour.deposit * guestCount;
    const communityItems =
        communityTab === "all"
            ? community[lang]
            : community[lang].filter((item) => item.type === communityTab);

    useEffect(() => {
        if (paused) return;

        const durationMs = 4200;
        const started = performance.now();
        let frameId = 0;

        const tick = (now: number) => {
            const elapsed = now - started;
            const nextProgress = Math.min((elapsed / durationMs) * 100, 100);

            setProgress(nextProgress);

            if (elapsed >= durationMs) {
                setSlideIndex((prev) => (prev + 1) % hero.length);
                return;
            }

            frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [hero.length, paused, slideIndex]);

    const resetFilters = () => {
        setKeyword("");
        setDuration("all");
        setRegion("all");
        setTheme("all");
        setSort("popular");
    };

    const changeLanguage = (nextLang: Locale) => {
        setLang(nextLang);
        setSlideIndex(0);
        setProgress(0);
    };

    return (
        <div
            className={`min-h-screen [font-family:var(--font-noto-sans-cjk),sans-serif] transition-colors duration-300 ${
                isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
            }`}
        >
            <SiteHeader
                brand={t.brand}
                navItems={navItems}
                activeKey="home"
                loginLabel={t.login}
                isDark={isDark}
                rightSlot={
                    <LanguageSwitcher
                        currentLocale={lang}
                        isDark={isDark}
                        mode="button"
                        onChange={changeLanguage}
                    />
                }
            />

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-6 lg:gap-6">
                <HeroSection
                    t={t}
                    currentSlide={currentSlide}
                    hero={hero}
                    slideIndex={slideIndex}
                    setSlideIndex={setSlideIndex}
                    paused={paused}
                    setPaused={setPaused}
                    progress={progress}
                    isDark={isDark}
                />

                <ToursSection
                    t={t}
                    lang={lang}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    duration={duration}
                    setDuration={setDuration}
                    region={region}
                    setRegion={setRegion}
                    theme={theme}
                    setTheme={setTheme}
                    sort={sort}
                    setSort={setSort}
                    filteredTours={filteredTours}
                    resetFilters={resetFilters}
                    setSelectedTourId={setSelectedTourId}
                    isDark={isDark}
                />

                <PromoBannerSection isDark={isDark} />

                <BookingSection
                    t={t}
                    lang={lang}
                    selectedTourId={selectedTourId}
                    setSelectedTourId={setSelectedTourId}
                    departDate={departDate}
                    setDepartDate={setDepartDate}
                    guestCount={guestCount}
                    setGuestCount={setGuestCount}
                    selectedTour={selectedTour}
                    depositPrice={depositPrice}
                    totalPrice={totalPrice}
                    paymentDone={paymentDone}
                    setPaymentDone={setPaymentDone}
                    isDark={isDark}
                />

                <CommunitySection
                    t={t}
                    communityTab={communityTab}
                    setCommunityTab={setCommunityTab}
                    communityItems={communityItems}
                    faqItems={faq[lang]}
                    isDark={isDark}
                />

                <PublishingSection items={publishingSteps[lang]} isDark={isDark} />
            </main>

            <SiteFooter
                brand={t.brand}
                description={t.footer}
                isDark={isDark}
            />
        </div>
    );
}