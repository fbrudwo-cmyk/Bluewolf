"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { community, copy, slides, tours, type Locale } from "@/lib/bluewolf-data";
import { formatPrice } from "@/lib/bluewolf-utils";
import { buildHeaderNav } from "@/lib/header-nav";
import { HeroSection } from "@/components/sections/HeroSection";
import { PromoBannerSection } from "@/components/sections/PromoBannerSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTheme } from "./theme";


// ─── 별빛 + 자전축 회전 캔버스 (다크모드) ───────────────────────────
function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();

        type Star = { dist: number; angle: number; r: number; phase: number; twinkleSpeed: number; twinkleAmp: number; cross: boolean; };
        let stars: Star[] = [];
        const init = () => {
            const cx = canvas.width * 0.5, cy = canvas.height * 2.2;
            stars = Array.from({ length: 160 }, () => {
                const x = Math.random() * canvas.width, y = Math.random() * canvas.height;
                const dx = x - cx, dy = y - cy;
                return { dist: Math.sqrt(dx*dx+dy*dy), angle: Math.atan2(dy,dx), r: Math.random()*1.7+0.2, phase: Math.random()*Math.PI*2,
                    twinkleSpeed: Math.random()<0.3 ? Math.random()*3+2 : Math.random()*0.6+0.15,
                    twinkleAmp: Math.random()*0.55+0.3, cross: Math.random()>0.74 };
            });
        };
        init();

        type Meteor = { x:number; y:number; vx:number; vy:number; speed:number; tailLen:number; life:number; };
        let meteors: Meteor[] = [];
        let nextMeteor = 2 + Math.random() * 4;
        const spawnMeteor = () => {
            const angle = Math.PI/9 + Math.random()*Math.PI/5.5, speed = 10+Math.random()*8;
            meteors.push({ x: Math.random()*canvas.width*1.2-canvas.width*0.1, y: -10+Math.random()*canvas.height*0.35,
                vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, speed, tailLen: 90+Math.random()*100, life: 1 });
        };

        let frameId = 0, t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.016;
            const cx = canvas.width*0.5, cy = canvas.height*2.2, rotation = t*0.004;
            stars.forEach(s => {
                const a = s.angle+rotation, x = cx+Math.cos(a)*s.dist, y = cy+Math.sin(a)*s.dist;
                if (x<-30||x>canvas.width+30||y<-30||y>canvas.height+30) {
                    const nx=Math.random()*canvas.width, ny=Math.random()*canvas.height, dx=nx-cx, dy=ny-cy;
                    s.dist=Math.sqrt(dx*dx+dy*dy); s.angle=Math.atan2(dy,dx)-rotation; s.phase=Math.random()*Math.PI*2; return;
                }
                const twinkle = s.twinkleAmp*Math.sin(t*s.twinkleSpeed+s.phase);
                const alpha = Math.max(0.04,Math.min(1,0.42+twinkle));
                const r = s.r*(0.8+0.2*Math.sin(t*s.twinkleSpeed*1.5+s.phase+0.8));
                const grad = ctx.createRadialGradient(x,y,0,x,y,r*1.8);
                grad.addColorStop(0,`rgba(255,255,255,${alpha})`); grad.addColorStop(0.5,`rgba(210,230,255,${alpha*0.6})`); grad.addColorStop(1,"rgba(150,190,255,0)");
                ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
                if (s.cross&&alpha>0.35) {
                    const len=r*5.5, la=alpha*0.28;
                    ctx.strokeStyle=`rgba(180,215,255,${la})`; ctx.lineWidth=r*0.45; ctx.lineCap="round";
                    ctx.beginPath(); ctx.moveTo(x-len,y); ctx.lineTo(x+len,y); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x,y-len); ctx.lineTo(x,y+len); ctx.stroke();
                }
            });
            if (t>=nextMeteor) { spawnMeteor(); nextMeteor=t+3+Math.random()*6; }
            meteors=meteors.filter(m=>m.life>0);
            meteors.forEach(m => {
                m.x+=m.vx; m.y+=m.vy; m.life-=0.022;
                const eased=m.life*m.life, steps=m.tailLen/m.speed, tx=m.x-m.vx*steps, ty=m.y-m.vy*steps;
                const tg=ctx.createLinearGradient(tx,ty,m.x,m.y);
                tg.addColorStop(0,"rgba(180,220,255,0)"); tg.addColorStop(0.6,`rgba(220,235,255,${eased*0.45})`); tg.addColorStop(1,`rgba(255,255,255,${eased})`);
                ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(m.x,m.y); ctx.strokeStyle=tg; ctx.lineWidth=1.8; ctx.lineCap="round"; ctx.stroke();
                const hg=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,4);
                hg.addColorStop(0,`rgba(255,255,255,${eased})`); hg.addColorStop(0.4,`rgba(200,230,255,${eased*0.6})`); hg.addColorStop(1,"rgba(150,200,255,0)");
                ctx.beginPath(); ctx.arc(m.x,m.y,4,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
            });
            frameId=requestAnimationFrame(draw);
        };
        draw();
        const ro=new ResizeObserver(()=>{resize();init()});
        ro.observe(canvas);
        return ()=>{cancelAnimationFrame(frameId);ro.disconnect()};
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

// ─── 구름 하늘 ───────────────────────────────────────────────────
function CloudField() {
    type CloudDef = { id: string; w: number; h: number; top: number; blur: number; opacity: number; duration: number; delay: number; seed: number; scale: number; };
    const [clouds, setClouds] = useState<CloudDef[]>([]);

    useEffect(() => {
        const N = 9, REF = 72;
        setClouds(Array.from({ length: N }, (_, i) => {
            const w        = 160 + Math.random() * 200;
            const h        = w   * (0.44 + Math.random() * 0.14);
            const blur     = 30  + Math.random() * 32;
            const opacity  = 0.82 + Math.random() * 0.18;
            const duration = 55  + Math.random() * 40;
            const shadowY  = 25  + Math.random() * 120;
            const top      = shadowY - 400;
            const slot     = i / N;
            const jitter   = (Math.random() - 0.5) * (1 / N) * 0.4;
            const delay    = -((slot + jitter) * REF);
            const seed     = Math.floor(Math.random() * 30) + 1;
            const scale    = 145 + Math.random() * 45;
            return { id: `cwf-${i}`, w, h, top, blur, opacity, duration, delay, seed, scale };
        }));
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0" style={{ borderRadius: "inherit", overflow: "hidden" }}>
            {/* 하늘 그라디언트 */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, #1a5faa 0%, #2e82cc 28%, #50a4e2 55%, #78c0ef 78%, #a6d8f7 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 42%, rgba(14,50,105,0.26) 100%)" }} />
            {/* SVG 필터 */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    {clouds.map(c => (
                        <filter key={c.id} id={c.id}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="10" seed={String(c.seed)} />
                            <feDisplacementMap in="SourceGraphic" scale={String(Math.round(c.scale))} />
                        </filter>
                    ))}
                </defs>
            </svg>
            <style>{`@keyframes cwDrift { from { left: 110%; } to { left: -80%; } }`}</style>
            {/* 구름 */}
            {clouds.map(c => (
                <div key={c.id} style={{
                    width: `${Math.round(c.w)}px`,
                    height: `${Math.round(c.h)}px`,
                    borderRadius: "50%",
                    filter: `url(#${c.id})`,
                    boxShadow: `400px 400px ${Math.round(c.blur)}px 0px rgba(255,255,255,${c.opacity.toFixed(2)})`,
                    position: "absolute",
                    top: `${Math.round(c.top)}px`,
                    animation: `cwDrift ${c.duration.toFixed(1)}s linear ${c.delay.toFixed(1)}s infinite backwards`,
                }} />
            ))}
        </div>
    );
}

// ─── 숫자 카운팅 카드 ─────────────────────────────────────────────
function StatCounter({ value, label, delay, isDark }: { value: string; label: string; delay: number; isDark: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [display, setDisplay] = useState("0");
    const [started, setStarted] = useState(false);
    const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

    const match = value.match(/^([\d,]+\.?\d*)(.*)$/);
    const num = parseFloat((match?.[1] ?? "0").replace(/,/g, ""));
    const suffix = match?.[2] ?? "";
    const isDecimal = (match?.[1] ?? "").includes(".");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        const duration = 1400;
        let frameId = 0;
        let startTime: number | null = null;

        const tick = (now: number) => {
            if (startTime === null) startTime = now + delay;
            if (now < startTime) { frameId = requestAnimationFrame(tick); return; }
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * num;
            setDisplay(isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString());
            if (progress < 1) frameId = requestAnimationFrame(tick);
            else setDisplay(isDecimal ? num.toFixed(1) : num.toLocaleString());
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [started, num, isDecimal, delay]);

    // 터치 기기 감지 (pointer: coarse)
    const isTouchRef = useRef<boolean | null>(null);
    const getIsTouch = () => {
        if (isTouchRef.current === null) {
            isTouchRef.current = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
        }
        return isTouchRef.current;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (getIsTouch()) return;
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({
            x: (e.clientX - r.left) / r.width,   // 0~1
            y: (e.clientY - r.top)  / r.height,
        });
    };

    // 3D tilt: 마우스 방향으로 최대 ±3°, 터치 기기에서는 비활성화
    const tilt = mouse
        ? {
            transform: `perspective(500px) rotateX(${(0.5 - mouse.y) * 3}deg) rotateY(${(mouse.x - 0.5) * 3}deg) scale(1.03)`,
            transition: "transform 0.08s linear",
        }
        : {
            transform: "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)",
            transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        };

    // 빛 반사: 마우스 위치 기준 radial gradient
    const glarePos = mouse ? `${mouse.x * 100}% ${mouse.y * 100}%` : "50% 50%";

    return (
        // animate-fade-up 를 wrapper 에 적용해 tilt 와 충돌 방지
        <div className="animate-fade-up" style={{ animationDelay: `${delay}ms` }} ref={ref}>
            <div
                className="group relative cursor-default overflow-hidden rounded-[16px] p-4 text-center sm:rounded-[22px] sm:p-5"
                style={isDark ? {
                    background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 100%)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,30,0.15), 0 6px 24px rgba(0,0,40,0.25)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    ...tilt,
                } : {
                    background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(180,220,255,0.12) 100%)",
                    border: "1px solid rgba(200,230,255,0.38)",
                    boxShadow: "inset 0 1px 0 rgba(220,240,255,0.55), inset 0 -1px 0 rgba(10,40,90,0.18), 0 6px 20px rgba(10,45,110,0.25)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    ...tilt,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMouse(null)}
            >
                {/* 상단 엣지 하이라이트 (유리 느낌) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                {/* 빛 반사 glare — hover 시만 표시 */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-[16px] transition-opacity duration-150 sm:rounded-[22px]"
                    style={{
                        opacity: mouse ? 1 : 0,
                        background: `radial-gradient(circle at ${glarePos}, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)`,
                    }}
                />

                {/* 콘텐츠 */}
                <div className="relative">
                    <div
                        className="text-2xl font-black tracking-tight text-white sm:text-4xl"
                        style={{ textShadow: isDark ? "0 1px 3px rgba(0,0,0,0.30)" : "0 2px 8px rgba(0,15,60,0.50), 0 1px 2px rgba(0,0,0,0.22)" }}
                    >
                        {display}{suffix}
                    </div>
                    <div
                        className="mt-1 text-xs font-semibold text-white sm:mt-1.5 sm:text-sm"
                        style={{ textShadow: isDark ? "none" : "0 1px 5px rgba(0,15,60,0.45)" }}
                    >{label}</div>
                </div>
            </div>
        </div>
    );
}

const homeExtra = {
    ko: {
        statsTitle: "BlueWolf가 특별한 이유",
        stat1Value: "4,500+",
        stat1Label: "누적 여행객",
        stat2Value: "8년",
        stat2Label: "몽골 전문 운영",
        stat3Value: "4.9",
        stat3Label: "평균 평점",
        stat4Value: "30+",
        stat4Label: "투어 상품",
        featuredTitle: "인기 여행 코스",
        featuredDesc: "블루울프 대표 투어 상품을 만나보세요.",
        viewAll: "투어 전체 보기",
        reserveNow: "예약하기",
        reviewTitle: "여행자들의 이야기",
        ctaTitle: "지금 바로 몽골 여행을 시작해보세요",
        ctaDesc: "입문형부터 프리미엄까지, 당신에게 맞는 일정으로 바로 예약 상담이 가능합니다.",
        ctaButton: "예약 상담 시작",
        ctaSecondary: "투어 살펴보기",
        priceFrom: "부터",
    },
    ja: {
        statsTitle: "BlueWolfが特別な理由",
        stat1Value: "4,500+",
        stat1Label: "累計旅行者",
        stat2Value: "8年",
        stat2Label: "モンゴル専門運営",
        stat3Value: "4.9",
        stat3Label: "平均評価",
        stat4Value: "30+",
        stat4Label: "ツアー商品",
        featuredTitle: "人気ツアー",
        featuredDesc: "BlueWolfの代表的なツアーをご覧ください。",
        viewAll: "ツアー一覧を見る",
        reserveNow: "予約する",
        reviewTitle: "旅行者のレビュー",
        ctaTitle: "今すぐモンゴル旅行を始めよう",
        ctaDesc: "入門コースからプレミアムまで、ご希望の日程で予約相談ができます。",
        ctaButton: "予約相談を開始",
        ctaSecondary: "ツアーを見る",
        priceFrom: "から",
    },
    en: {
        statsTitle: "Why BlueWolf",
        stat1Value: "4,500+",
        stat1Label: "Happy travelers",
        stat2Value: "8 yrs",
        stat2Label: "Mongolia expertise",
        stat3Value: "4.9",
        stat3Label: "Average rating",
        stat4Value: "30+",
        stat4Label: "Tour products",
        featuredTitle: "Featured Tours",
        featuredDesc: "Explore BlueWolf's most popular itineraries.",
        viewAll: "View all tours",
        reserveNow: "Book now",
        reviewTitle: "Traveler stories",
        ctaTitle: "Start your Mongolia journey today",
        ctaDesc: "From first-timers to premium travelers, get a quote for your perfect itinerary.",
        ctaButton: "Start booking",
        ctaSecondary: "Browse tours",
        priceFrom: " from",
    },
} as const;

export default function Page() {
    const { isDark } = useTheme();
    const [lang, setLang] = useState<Locale>("ko");
    const [slideIndex, setSlideIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const t = copy[lang];
    const h = homeExtra[lang];
    const hero = slides[lang];
    const currentSlide = hero[slideIndex % hero.length];

    const navItems = useMemo(
        () => buildHeaderNav({ locale: lang, t }),
        [lang, t]
    );

    const reviews = community[lang].filter((item) => item.type === "review");

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
        return () => { window.cancelAnimationFrame(frameId); };
    }, [hero.length, paused, slideIndex]);

    const changeLanguage = (nextLang: Locale) => {
        setLang(nextLang);
        setSlideIndex(0);
        setProgress(0);
    };

    const sectionBase = `rounded-[24px] border p-4 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-6 lg:p-7 ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
    }`;

    const statsData = [
        [h.stat1Value, h.stat1Label],
        [h.stat2Value, h.stat2Label],
        [h.stat3Value, h.stat3Label],
        [h.stat4Value, h.stat4Label],
    ] as const;

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

                {/* 통계 섹션 */}
                <section
                    className="relative overflow-hidden rounded-[24px] p-6 sm:rounded-[28px] sm:p-8"
                    style={{
                        background: isDark ? "#06102e" : "transparent",
                        boxShadow: isDark
                            ? "0 16px 48px rgba(6,16,46,0.50)"
                            : "0 12px 40px rgba(20,70,140,0.28)",
                        transition: "background 0.85s ease, box-shadow 0.85s ease",
                    }}
                >
                    {/* 별(다크) / 구름(라이트) 크로스페이드 */}
                    <div className="pointer-events-none absolute inset-0" style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.85s ease" }}>
                        <StarField />
                    </div>
                    <div className="pointer-events-none absolute inset-0" style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.85s ease" }}>
                        <CloudField />
                    </div>

                    <h2
                        className="relative text-xl font-black tracking-tight text-white sm:text-2xl"
                        style={{ textShadow: isDark ? "0 1px 4px rgba(0,0,0,0.50)" : "0 2px 10px rgba(0,15,60,0.55), 0 1px 3px rgba(0,0,0,0.25)" }}
                    >
                        {h.statsTitle}
                    </h2>

                    <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {statsData.map(([value, label], i) => (
                            <StatCounter key={label} value={value} label={label} delay={i * 120} isDark={isDark} />
                        ))}
                    </div>
                </section>

                {/* 추천 투어 미리보기 */}
                <section className={sectionBase}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                {h.featuredTitle}
                            </h2>
                            <p className={`mt-2 text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                                {h.featuredDesc}
                            </p>
                        </div>
                        <Link
                            href="/tours"
                            className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.97] active:translate-y-0 ${
                                isDark
                                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}
                        >
                            {h.viewAll} →
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tours.map((tour) => (
                            <Link
                                key={tour.id}
                                href={`/tours/${tour.id}`}
                                className="relative h-[200px] overflow-hidden rounded-[22px] shadow-sm transition-[transform,box-shadow] duration-700 ease-in-out hover:-translate-y-[3px] hover:shadow-xl active:scale-[0.98] sm:h-[240px]"
                            >
                                <Image
                                    src={tour.heroImage}
                                    alt={tour.title[lang]}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                />

                                <div className="absolute left-3 top-3 flex items-center gap-2 sm:left-4 sm:top-4">
                                    <span className="rounded-full bg-blue-600/85 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
                                        {(t as unknown as Record<string, string>)[tour.theme]}
                                    </span>
                                    <span className="rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
                                        {tour.duration[lang]}
                                    </span>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-16 text-white sm:px-5 sm:pb-5 sm:pt-20">
                                    <h3 className="text-sm font-black leading-tight tracking-tight sm:text-base">
                                        {tour.title[lang]}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">
                                        {tour.desc[lang]}
                                    </p>
                                    <div className="mt-2.5 flex items-end justify-between gap-2">
                                        <div className="flex flex-wrap gap-1">
                                            {tour.tags[lang].slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm sm:text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="shrink-0 text-lg font-black tracking-tight sm:text-xl">
                                            {formatPrice(tour.price)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <PromoBannerSection isDark={isDark} />

                {/* 여행자 후기 */}
                {reviews.length > 0 && (
                    <section className={sectionBase}>
                        <h2 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                            {h.reviewTitle}
                        </h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {reviews.map((review, index) => (
                                <div
                                    key={`${review.author}-${index}`}
                                    className={`flex flex-col gap-3 rounded-[22px] border p-5 transition-colors duration-300 ${
                                        isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"
                                    }`}
                                >
                                    <div className="flex gap-0.5 text-amber-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className={`flex-1 text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                        &ldquo;{review.text}&rdquo;
                                    </p>
                                    <div className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {review.author}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA 배너 */}
                <section className="overflow-hidden rounded-[28px] bg-blue-600 p-8 text-white shadow-lg lg:p-10">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{h.ctaTitle}</h2>
                        <p className="mt-4 text-base leading-8 text-blue-100 sm:text-lg">{h.ctaDesc}</p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href="/booking"
                                className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-900 shadow-sm transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[2px] hover:bg-slate-50 active:scale-[0.97] active:translate-y-0"
                            >
                                {h.ctaButton}
                            </Link>
                            <Link
                                href="/tours"
                                className="rounded-2xl bg-white/12 px-6 py-4 font-bold text-white transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[2px] hover:bg-white/20 active:scale-[0.97] active:translate-y-0"
                            >
                                {h.ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter brand={t.brand} description={t.footer} isDark={isDark} />
        </div>
    );
}
