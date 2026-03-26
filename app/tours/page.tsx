"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { tours, type Region } from "@/lib/bluewolf-data";
import { filterTours, formatPrice } from "@/lib/bluewolf-utils";
import { ToursSection } from "@/components/sections/ToursSection";
import { PageShell, usePage } from "@/components/layout/PageShell";

// 지역별 메타 정보 (이미지, 설명, 부제)
const regionMeta = {
    south: {
        image: "/images/hero-gobi.jpg",
        gradient: "from-blue-900/70 to-blue-600/50",
        subtitleKo: "고비 사막",
        subtitleJa: "ゴビ砂漠",
        subtitleEn: "Gobi Desert",
        labelKo: "남부",
        labelJa: "南部",
        labelEn: "South",
        descKo: "4박~7박 · 사막, 협곡, 별보기",
        descJa: "4泊〜7泊 · 砂漠、渓谷、星空",
        descEn: "4–7 nights · Desert, canyon, stargazing",
    },
    north: {
        image: "/images/hero-khuvsgul.jpg",
        gradient: "from-violet-900/70 to-indigo-600/50",
        subtitleKo: "홉스골 호수",
        subtitleJa: "フブスグル湖",
        subtitleEn: "Khuvsgul Lake",
        labelKo: "북부",
        labelJa: "北部",
        labelEn: "North",
        descKo: "4박~7박 · 호수, 숲, 승마",
        descJa: "4泊〜7泊 · 湖、森、乗馬",
        descEn: "4–7 nights · Lake, forest, horse riding",
    },
    central: {
        image: "/images/hero-terelj.jpg",
        gradient: "from-sky-900/70 to-blue-600/50",
        subtitleKo: "테를지 초원",
        subtitleJa: "テレルジ草原",
        subtitleEn: "Terelj Steppe",
        labelKo: "중부",
        labelJa: "中部",
        labelEn: "Central",
        descKo: "1박~5박 · 초원, 온천, 가족 여행",
        descJa: "1泊〜5泊 · 草原、温泉、家族旅行",
        descEn: "1–5 nights · Steppe, hot springs, family travel",
    },
    west: {
        image: "/images/hero-altai.jpg",
        gradient: "from-amber-900/70 to-orange-600/50",
        subtitleKo: "알타이 산맥",
        subtitleJa: "アルタイ山脈",
        subtitleEn: "Altai Mountains",
        labelKo: "서부",
        labelJa: "西部",
        labelEn: "West",
        descKo: "7박~12박 · 산악, 독수리 사냥, 어드벤처",
        descJa: "7泊〜12泊 · 山岳、鷹狩り、アドベンチャー",
        descEn: "7–12 nights · Mountains, eagle hunting, adventure",
    },
} as const;

type RegionKey = keyof typeof regionMeta;
const regionOrder: RegionKey[] = ["south", "north", "central", "west"];

function RegionSelector({
    onSelect,
    selectedRegion,
}: {
    onSelect: (region: Region) => void;
    selectedRegion: Region | null;
}) {
    const { lang, isDark } = usePage();

    const regionTitle = {
        ko: "어디로 여행을 떠나고 싶으신가요?",
        ja: "どこへ旅立ちたいですか？",
        en: "Where would you like to travel?",
    }[lang];

    const fromLabel = {
        ko: "부터",
        ja: "から",
        en: "from",
    }[lang];


    return (
        <section
            className={`rounded-[24px] border p-6 shadow-sm sm:rounded-[28px] sm:p-8 ${
                isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
            }`}
        >
            <h1
                className={`text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${
                    isDark ? "text-white" : "text-slate-900"
                }`}
            >
                {regionTitle}
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {regionOrder.map((key) => {
                    const meta = regionMeta[key];
                    const label = lang === "ko" ? meta.labelKo : lang === "ja" ? meta.labelJa : meta.labelEn;
                    const subtitle = lang === "ko" ? meta.subtitleKo : lang === "ja" ? meta.subtitleJa : meta.subtitleEn;

                    const regionTours = tours.filter((tour) => tour.region === key);
                    const minPrice = Math.min(...regionTours.map((tour) => tour.price));

                    const isSelected = selectedRegion === key;

                    return (
                        <button
                            key={key}
                            onClick={() => onSelect(key as Region)}
                            className={`group relative overflow-hidden text-left transition-[transform,box-shadow] duration-700 ease-in-out hover:-translate-y-[3px] hover:shadow-xl active:scale-[0.98] ${
                                isSelected
                                    ? "rounded-[22px] ring-4 ring-blue-500 ring-offset-2"
                                    : "rounded-[22px]"
                            }`}
                        >
                            <div className="relative h-52 sm:h-60">
                                <Image
                                    src={meta.image}
                                    alt={subtitle}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-b ${meta.gradient}`}
                                />
                                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                                    <div className="flex items-start justify-between">
                                        <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold backdrop-blur-sm">
                                            {label}
                                        </span>
                                        {isSelected && (
                                            <span className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-extrabold">
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black tracking-tight sm:text-3xl">
                                            {subtitle}
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-base font-black">
                                                {lang === "en" ? `${fromLabel} ` : ""}{formatPrice(minPrice)}{lang !== "en" ? ` ${fromLabel}` : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function ToursContent() {
    const { lang, isDark, t } = usePage();
    const router = useRouter();

    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [keyword, setKeyword] = useState("");
    const [duration, setDuration] = useState("all");
    const [theme, setTheme] = useState("all");
    const [sort, setSort] = useState("popular");

    const filteredTours = useMemo(
        () =>
            filterTours(
                tours,
                lang,
                keyword,
                duration,
                selectedRegion ?? "all",
                theme,
                sort
            ),
        [duration, keyword, lang, selectedRegion, sort, theme]
    );

    const resetFilters = () => {
        setKeyword("");
        setDuration("all");
        setTheme("all");
        setSort("popular");
    };

    const handleRegionSelect = (region: Region) => {
        setSelectedRegion((prev) => prev === region ? null : region);
        document.getElementById("tours-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <RegionSelector onSelect={handleRegionSelect} selectedRegion={selectedRegion} />
            <div id="tours-list">
                <ToursSection
                    t={t}
                    lang={lang}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    duration={duration}
                    setDuration={setDuration}
                    region={selectedRegion ?? "all"}
                    setRegion={() => {}}
                    theme={theme}
                    setTheme={setTheme}
                    sort={sort}
                    setSort={setSort}
                    filteredTours={filteredTours}
                    resetFilters={resetFilters}
                    setSelectedTourId={(id) => router.push(`/tours/${id}`)}
                    isDark={isDark}
                />
            </div>
        </>
    );
}

export default function ToursPage() {
    return (
        <PageShell activeKey="tours">
            <ToursContent />
        </PageShell>
    );
}
