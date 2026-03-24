import Image from "next/image";
import { Dropdown } from "@/components/ui/Dropdown";
import { copy, type Locale, type Tour } from "@/lib/bluewolf-data";
import { formatPrice } from "@/lib/bluewolf-utils";

type CopyValue = (typeof copy)[Locale];

const inputClass =
    "h-12 sm:h-14 rounded-2xl border px-4 sm:px-5 text-[15px] sm:text-[16px] font-semibold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50";

const primaryButton =
    "group relative overflow-hidden rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500";
const secondaryButton =
    "group relative overflow-hidden rounded-2xl px-4 py-3 font-bold transition-all duration-300 hover:-translate-y-0.5";
const overlaySpan =
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_60%)]";
const shineSpan =
    "pointer-events-none absolute inset-y-0 left-[-30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100";

export function ToursSection({
    t,
    lang,
    keyword,
    setKeyword,
    duration,
    setDuration,
    region,
    setRegion,
    theme,
    setTheme,
    sort,
    setSort,
    filteredTours,
    resetFilters,
    setSelectedTourId,
    isDark,
}: {
    t: CopyValue;
    lang: Locale;
    keyword: string;
    setKeyword: (value: string) => void;
    duration: string;
    setDuration: (value: string) => void;
    region: string;
    setRegion: (value: string) => void;
    theme: string;
    setTheme: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    filteredTours: Tour[];
    resetFilters: () => void;
    setSelectedTourId: (id: number) => void;
    isDark: boolean;
}) {
    return (
        <section
            id="tours"
            className={`rounded-[24px] border p-4 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-6 lg:p-7 ${
                isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
            }`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                        {t.featured}
                    </h2>
                    <p className={`mt-2 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        {t.featuredDesc}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-full sm:w-[220px]">
                        <Dropdown
                            value={sort}
                            onChange={setSort}
                            options={[
                                { value: "popular", label: t.popularSort },
                                { value: "priceLow", label: t.lowSort },
                                { value: "priceHigh", label: t.highSort },
                            ]}
                            isDark={isDark}
                        />
                    </div>

                    <button
                        onClick={resetFilters}
                        className={`rounded-2xl px-4 py-3 font-bold transition ${
                            isDark
                                ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                        }`}
                    >
                        {t.reset}
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`${inputClass} sm:col-span-2 xl:col-span-2 ${
                        isDark
                            ? "border-white/10 bg-slate-950 text-slate-100 focus:bg-slate-900"
                            : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
                    }`}
                />
                <Dropdown
                    value={duration}
                    onChange={setDuration}
                    options={[
                        { value: "all", label: t.allDuration },
                        { value: "short", label: t.shortDuration },
                        { value: "long", label: t.longDuration },
                    ]}
                    isDark={isDark}
                />
                <Dropdown
                    value={region}
                    onChange={setRegion}
                    options={[
                        { value: "all", label: t.allRegion },
                        { value: "gobi", label: t.gobi },
                        { value: "central", label: t.central },
                        { value: "north", label: t.north },
                    ]}
                    isDark={isDark}
                />
                <Dropdown
                    value={theme}
                    onChange={setTheme}
                    options={[
                        { value: "all", label: t.allTheme },
                        { value: "desert", label: t.desert },
                        { value: "family", label: t.family },
                        { value: "premium", label: t.premium },
                    ]}
                    isDark={isDark}
                />
            </div>

            {filteredTours.length === 0 ? (
                <div
                    className={`mt-6 rounded-[24px] border p-6 sm:p-8 ${
                        isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"
                    }`}
                >
                    <h3 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                        {t.noResults}
                    </h3>
                    <p className={`mt-2 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        {t.noResultsDesc}
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTours.map((tour) => (
                        <article
                            key={tour.id}
                            className={`overflow-hidden rounded-[24px] border shadow-sm transition-colors duration-300 sm:rounded-[26px] ${
                                isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                            }`}
                        >
                            <div className="relative min-h-[190px] overflow-hidden sm:min-h-[210px]">
                                <Image
                                    src={tour.heroImage}
                                    alt={tour.title[lang]}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                />

                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.18))]" />

                                <div className="relative z-10 flex min-h-[190px] flex-col justify-between p-4 text-white sm:min-h-[210px] sm:p-6">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full border border-white/25 bg-white/16 px-3 py-2 text-xs font-extrabold backdrop-blur-sm">
                                            {tour.duration[lang]}
                                        </span>
                                        {tour.tags[lang].slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-white/25 bg-white/16 px-3 py-2 text-xs font-extrabold backdrop-blur-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div />
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <h3 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {tour.title[lang]}
                                </h3>
                                <p className={`mt-3 min-h-[auto] text-sm leading-7 sm:min-h-[72px] sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                    {tour.desc[lang]}
                                </p>

                                <div className={`mt-4 text-sm font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {t.priceLabel}
                                </div>
                                <div className={`mt-1 text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {formatPrice(tour.price)}
                                </div>

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    <button onClick={() => setSelectedTourId(tour.id)} className={primaryButton}>
                                        <span className={overlaySpan} />
                                        <span className={shineSpan} />
                                        <span className="relative z-10">{t.reserve}</span>
                                    </button>

                                    <button
                                        onClick={() => setSelectedTourId(tour.id)}
                                        className={`${secondaryButton} ${
                                            isDark
                                                ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                        }`}
                                    >
                                        <span className={overlaySpan} />
                                        <span className={shineSpan} />
                                        <span className="relative z-10">{t.details}</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}