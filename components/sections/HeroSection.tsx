import Image from "next/image";
import { copy, type HeroSlide, type Locale } from "@/lib/bluewolf-data";

type CopyValue = (typeof copy)[Locale];

const primaryButton =
    "group relative overflow-hidden rounded-2xl bg-blue-600 px-4 py-3 font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[3px] hover:bg-blue-500 hover:shadow-[0_14px_28px_rgba(37,99,235,0.32)] active:scale-[0.97] active:translate-y-0 sm:px-5 sm:py-4";

const secondaryButton =
    "group relative overflow-hidden rounded-2xl px-4 py-3 font-bold transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[3px] active:scale-[0.97] active:translate-y-0 sm:px-5 sm:py-4";

const overlaySpan =
    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_60%)]";

const shineSpan =
    "pointer-events-none absolute inset-y-0 left-[-30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[120%] group-hover:opacity-100";

export function HeroSection({
    t,
    currentSlide,
    hero,
    slideIndex,
    setSlideIndex,
    paused,
    setPaused,
    progress,
    isDark,
}: {
    t: CopyValue;
    currentSlide: HeroSlide;
    hero: HeroSlide[];
    slideIndex: number;
    setSlideIndex: (value: number) => void;
    paused: boolean;
    setPaused: (value: boolean) => void;
    progress: number;
    isDark: boolean;
}) {
    return (
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-5">
            <div
                className={`relative overflow-hidden rounded-[24px] border shadow-[0_18px_48px_rgba(15,23,42,0.06)] transition-colors duration-300 sm:rounded-[28px] ${
                    isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                }`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {hero.map((slide, index) => (
                    <div
                        key={`${slide.eyebrow}-${index}`}
                        className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            index === slideIndex ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                    >
                        <div className="absolute inset-0">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={index === 0}
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>

                        <div
                            className={`absolute inset-0 ${
                                isDark
                                    ? "bg-[linear-gradient(180deg,rgba(2,6,23,0.78)_0%,rgba(2,6,23,0.54)_20%,rgba(2,6,23,0.28)_48%,rgba(2,6,23,0.10)_72%,rgba(2,6,23,0)_100%)]"
                                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.58)_20%,rgba(255,255,255,0.28)_48%,rgba(255,255,255,0.10)_72%,rgba(255,255,255,0)_100%)]"
                            }`}
                        />

                        <div
                            className={`absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,black_0%,black_34%,transparent_100%)] ${
                                isDark
                                    ? "bg-[linear-gradient(180deg,rgba(2,6,23,0.22)_0%,rgba(2,6,23,0.12)_26%,rgba(2,6,23,0.03)_48%,rgba(2,6,23,0)_100%)]"
                                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_26%,rgba(255,255,255,0.03)_48%,rgba(255,255,255,0)_100%)]"
                            }`}
                        />
                    </div>
                ))}

                <a href="#tours" className="absolute inset-0 z-10" aria-label="Open featured tour section" />

                <div className="relative z-10 flex min-h-[440px] flex-col justify-between p-5 sm:min-h-[520px] sm:p-7 lg:min-h-[605px] lg:p-10">
                    <div>
                        <span className="inline-flex rounded-full bg-white/82 px-3 py-2 text-xs font-extrabold text-blue-700 shadow-[0_6px_16px_rgba(59,130,246,0.10)] backdrop-blur-md sm:px-4 sm:text-sm">
                            {currentSlide.eyebrow}
                        </span>

                        <h2
                            className={`mt-4 max-w-3xl whitespace-pre-line text-[30px] font-black leading-[1.05] tracking-tight sm:text-[40px] lg:mt-5 lg:text-[64px] ${
                                isDark ? "text-white" : "text-slate-900"
                            }`}
                        >
                            {currentSlide.title}
                        </h2>

                        <p
                            className={`mt-4 max-w-2xl text-[15px] font-medium leading-7 sm:text-[17px] lg:mt-6 lg:text-[19px] ${
                                isDark ? "text-slate-200" : "text-slate-700"
                            }`}
                        >
                            {currentSlide.desc}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                        <div className="flex flex-col gap-3">
                            <div
                                className={`h-1.5 w-32 overflow-hidden rounded-full sm:w-44 ${
                                    isDark ? "bg-white/20" : "bg-white/70 shadow-inner"
                                }`}
                            >
                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                            </div>

                            <div className="flex gap-2">
                                {hero.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSlideIndex(index)}
                                        className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                            index === slideIndex
                                                ? "w-8 bg-blue-600"
                                                : isDark
                                                  ? "w-2.5 bg-white/25 hover:bg-white/40"
                                                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                        }`}
                                        aria-label={`slide-${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            className={`w-fit rounded-full px-4 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:text-sm ${
                                isDark ? "bg-slate-900/80 text-slate-200" : "bg-white/82 text-slate-600"
                            }`}
                        >
                            {paused ? t.pausedLabel : t.featuredLabel}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:gap-5">
                <div
                    className={`rounded-[24px] border p-5 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-7 ${
                        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                    }`}
                >
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 sm:px-4 sm:text-sm">
                        {t.heroBadge}
                    </span>

                    <h1
                        className={`mt-4 whitespace-pre-line text-3xl font-black tracking-tight sm:text-4xl lg:mt-5 lg:text-5xl ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        {t.heroTitle}
                    </h1>

                    <p className={`mt-4 text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        {t.heroDesc}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <a href="#tours" className={primaryButton}>
                            <span className={overlaySpan} />
                            <span className={shineSpan} />
                            <span className="relative z-10">{t.heroPrimary}</span>
                        </a>

                        <a
                            href="#booking"
                            className={`${secondaryButton} ${
                                isDark
                                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}
                        >
                            <span className={overlaySpan} />
                            <span className={shineSpan} />
                            <span className="relative z-10">{t.heroSecondary}</span>
                        </a>
                    </div>
                </div>

                <div
                    className={`rounded-[24px] border p-5 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-7 ${
                        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                    }`}
                >
                    <h2 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                        {t.communityTitle}
                    </h2>

                    <p className={`mt-3 text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        {t.footer}
                    </p>
                </div>
            </div>
        </section>
    );
}