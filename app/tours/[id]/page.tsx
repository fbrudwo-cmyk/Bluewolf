"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/bluewolf-data";
import { formatPrice } from "@/lib/bluewolf-utils";
import { PageShell, usePage } from "@/components/layout/PageShell";

type Tab = "intro" | "itinerary" | "includes" | "terms";

const includesData = {
    ko: ["전용 차량 및 현지 기사", "전문 한국어 가이드", "게르 또는 호텔 숙박", "현지 식사 (포함 일정 기준)", "입장료 및 체험 활동비", "공항 픽업·샌딩"],
    ja: ["専用車両・現地ドライバー", "日本語専門ガイド", "ゲルまたはホテル宿泊", "現地食事（日程による）", "入場料・アクティビティ費", "空港送迎"],
    en: ["Private vehicle & local driver", "Professional English guide", "Ger or hotel accommodation", "Meals per itinerary", "Entry fees & activity costs", "Airport transfers"],
};

const excludesData = {
    ko: ["국제 항공권", "여행자 보험", "비자 비용", "개인 경비 및 기념품", "음주 비용", "선택 액티비티 추가 비용"],
    ja: ["国際航空券", "旅行保険", "ビザ費用", "個人経費・お土産", "飲酒費用", "オプションアクティビティ追加費用"],
    en: ["International flights", "Travel insurance", "Visa fees", "Personal expenses & souvenirs", "Alcoholic beverages", "Optional activity surcharges"],
};

const cancelPolicy = {
    ko: [
        ["출발 30일 전 이상", "전액 환불"],
        ["출발 20~29일 전", "예약금 제외 환불"],
        ["출발 10~19일 전", "여행 요금의 50% 환불"],
        ["출발 7~9일 전", "여행 요금의 30% 환불"],
        ["출발 7일 미만", "환불 불가"],
    ],
    ja: [
        ["出発30日以上前", "全額返金"],
        ["出発20〜29日前", "予約金を除き返金"],
        ["出発10〜19日前", "旅行料金の50%返金"],
        ["出発7〜9日前", "旅行料金の30%返金"],
        ["出発7日未満", "返金不可"],
    ],
    en: [
        ["30+ days before departure", "Full refund"],
        ["20–29 days before", "Refund minus deposit"],
        ["10–19 days before", "50% refund"],
        ["7–9 days before", "30% refund"],
        ["Under 7 days", "No refund"],
    ],
};

const regionLabel: Record<string, Record<string, string>> = {
    south: { ko: "남부", ja: "南部", en: "South" },
    north: { ko: "북부", ja: "北部", en: "North" },
    central: { ko: "중부", ja: "中部", en: "Central" },
    west: { ko: "서부", ja: "西部", en: "West" },
};

const tabLabels: Record<Tab, Record<string, string>> = {
    intro: { ko: "상품 소개", ja: "商品紹介", en: "Overview" },
    itinerary: { ko: "여행 일정", ja: "旅行日程", en: "Itinerary" },
    includes: { ko: "포함/불포함", ja: "含む/含まない", en: "Includes" },
    terms: { ko: "이용약관", ja: "利用規約", en: "Terms" },
};

function TourDetailContent() {
    const { lang, isDark, t } = usePage();
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("intro");
    const [guests, setGuests] = useState(2);

    const tourId = Number(params.id);
    const tour = tours.find((tr) => tr.id === tourId);


    if (!tour) {
        router.replace("/tours");
        return null;
    }

    const totalPrice = tour.price * guests;
    const depositPrice = tour.deposit * guests;
    const region = regionLabel[tour.region][lang];
    const themeLabel = (t as unknown as Record<string, string>)[tour.theme];

    const panelBase = `rounded-[24px] border sm:rounded-[28px] ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
    }`;

    const tabs: Tab[] = ["intro", "itinerary", "includes", "terms"];

    const isNoRefund = (s: string) =>
        s.includes("불가") || s.includes("No refund") || s.includes("不可");

    return (
        <>
            {/* ── 히어로 ── */}
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]" style={{ height: "clamp(280px, 44vw, 480px)" }}>
                <Image
                    src={tour.heroImage}
                    alt={tour.title[lang]}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-10">
                    {/* 브레드크럼 */}
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-white/60 sm:text-sm">
                        <Link href="/tours" className="transition-colors duration-150 hover:text-white">
                            {lang === "ko" ? "투어상품" : lang === "ja" ? "ツアー" : "Tours"}
                        </Link>
                        <span>/</span>
                        <span>{region}</span>
                        <span>/</span>
                        <span className="text-white/90">{tour.title[lang]}</span>
                    </div>

                    {/* 배지 */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-600/90 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
                            {themeLabel}
                        </span>
                        <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
                            {region}
                        </span>
                        <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
                            {tour.duration[lang]}
                        </span>
                    </div>

                    <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-4xl">
                        {tour.title[lang]}
                    </h1>
                </div>
            </div>

            {/* ── 2컬럼 레이아웃 ── */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">

                {/* ── 왼쪽 메인 콘텐츠 ── */}
                <div className="min-w-0 flex-1">

                    {/* 탭 바 */}
                    <div className={`rounded-[20px] border p-1.5 ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>
                        <div className="flex gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 rounded-[14px] px-2 py-2.5 text-xs font-bold transition-[background-color,color,box-shadow] duration-200 sm:text-sm ${
                                        activeTab === tab
                                            ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.22)]"
                                            : isDark
                                              ? "text-slate-400 hover:bg-white/5 hover:text-white"
                                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    {tabLabels[tab][lang]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 탭 콘텐츠 */}
                    <div className={`mt-4 ${panelBase} p-5 sm:p-6 lg:p-8`}>

                        {/* ── 상품 소개 ── */}
                        {activeTab === "intro" && (
                            <div className="flex flex-col gap-8">
                                <div>
                                    <h2 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {tabLabels.intro[lang]}
                                    </h2>
                                    <p className={`mt-3 text-base leading-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                        {tour.desc[lang]}
                                    </p>
                                </div>

                                {/* 핵심 포인트 */}
                                <div>
                                    <h3 className={`mb-4 text-base font-black sm:text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {lang === "ko" ? "핵심 포인트" : lang === "ja" ? "ハイライト" : "Highlights"}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {tour.highlights[lang].map((hl, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 rounded-[18px] border p-4 ${
                                                    isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"
                                                }`}
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                                                    {i + 1}
                                                </span>
                                                <span className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                                                    {hl}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 갤러리 이미지 */}
                                <div>
                                    <h3 className={`mb-4 text-base font-black sm:text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {lang === "ko" ? "여행지 사진" : lang === "ja" ? "旅行写真" : "Gallery"}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                        {tour.images.map((src, i) => (
                                            <div key={i} className="relative overflow-hidden rounded-[16px]" style={{ aspectRatio: "4/3" }}>
                                                <Image
                                                    src={src}
                                                    alt={`${tour.title[lang]} ${i + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.06]"
                                                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 22vw, 15vw"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 상품 상세 이미지 */}
                                {tour.detailImages.length > 0 && (
                                    <div>
                                        <h3 className={`mb-4 text-base font-black sm:text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {lang === "ko" ? "상품 상세" : lang === "ja" ? "商品詳細" : "Tour Details"}
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {tour.detailImages.map((src, i) => (
                                                <div key={i} className={`overflow-hidden rounded-[18px] border ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                                    <Image
                                                        src={src}
                                                        alt={`${tour.title[lang]} 상세 ${i + 1}`}
                                                        width={800}
                                                        height={0}
                                                        style={{ width: "100%", height: "auto" }}
                                                        className="block"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 65vw, 50vw"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 태그 */}
                                <div>
                                    <h3 className={`mb-3 text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {lang === "ko" ? "여행 태그" : lang === "ja" ? "旅行タグ" : "Tags"}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tour.tags[lang].map((tag) => (
                                            <span
                                                key={tag}
                                                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                                                    isDark
                                                        ? "border-white/10 bg-slate-800 text-slate-200"
                                                        : "border-slate-200 bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── 여행 일정 ── */}
                        {activeTab === "itinerary" && (
                            <div>
                                <h2 className={`mb-6 text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {tabLabels.itinerary[lang]}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {tour.highlights[lang].map((hl, i) => {
                                        const isLast = i === tour.highlights[lang].length - 1;
                                        const dayImg = tour.images[i % tour.images.length];
                                        return (
                                            <div key={i} className="flex gap-3 sm:gap-4">
                                                {/* 타임라인 */}
                                                <div className="flex flex-col items-center pt-1">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow-[0_6px_16px_rgba(37,99,235,0.28)]">
                                                        {i + 1}
                                                    </div>
                                                    {!isLast && (
                                                        <div className={`mt-2 w-0.5 flex-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} style={{ minHeight: "40px" }} />
                                                    )}
                                                </div>

                                                {/* 카드 */}
                                                <div className={`flex-1 overflow-hidden rounded-[20px] border ${isLast ? "mb-0" : "mb-1"} ${isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                                                    {/* 이미지 */}
                                                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
                                                        <Image
                                                            src={dayImg}
                                                            alt={hl}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 65vw, 50vw"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                        <span className="absolute left-3 top-3 rounded-full bg-blue-600/90 px-2.5 py-1 text-xs font-black text-white backdrop-blur-sm">
                                                            {lang === "ko" ? `${i + 1}일차` : lang === "ja" ? `${i + 1}日目` : `Day ${i + 1}`}
                                                        </span>
                                                    </div>

                                                    {/* 텍스트 */}
                                                    <div className="p-4 sm:p-5">
                                                        <h3 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                                            {hl}
                                                        </h3>
                                                        <p className={`mt-1.5 text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                            {tour.desc[lang]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── 포함/불포함 ── */}
                        {activeTab === "includes" && (
                            <div className="flex flex-col gap-6">
                                <h2 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {tabLabels.includes[lang]}
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* 포함 */}
                                    <div className={`rounded-[20px] border p-5 ${isDark ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50"}`}>
                                        <div className="mb-4 flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white">✓</span>
                                            <h3 className={`font-black ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                                                {lang === "ko" ? "포함 사항" : lang === "ja" ? "含む" : "Included"}
                                            </h3>
                                        </div>
                                        <ul className="flex flex-col gap-2.5">
                                            {includesData[lang].map((item) => (
                                                <li key={item} className={`flex items-start gap-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                    <span className="mt-1 shrink-0 text-emerald-500">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* 불포함 */}
                                    <div className={`rounded-[20px] border p-5 ${isDark ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50"}`}>
                                        <div className="mb-4 flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-black text-white">✕</span>
                                            <h3 className={`font-black ${isDark ? "text-red-400" : "text-red-700"}`}>
                                                {lang === "ko" ? "불포함 사항" : lang === "ja" ? "含まない" : "Excluded"}
                                            </h3>
                                        </div>
                                        <ul className="flex flex-col gap-2.5">
                                            {excludesData[lang].map((item) => (
                                                <li key={item} className={`flex items-start gap-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                                    <span className="mt-1 shrink-0 text-red-400">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── 이용약관 ── */}
                        {activeTab === "terms" && (
                            <div>
                                <h2 className={`mb-6 text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {lang === "ko" ? "취소 및 환불 정책" : lang === "ja" ? "キャンセル・返金ポリシー" : "Cancellation Policy"}
                                </h2>

                                <div className={`overflow-hidden rounded-[20px] border ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={isDark ? "bg-slate-800" : "bg-slate-100"}>
                                                <th className={`px-5 py-3.5 text-left text-xs font-black tracking-wide ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                    {lang === "ko" ? "취소 시점" : lang === "ja" ? "取消時期" : "Cancellation Timing"}
                                                </th>
                                                <th className={`px-5 py-3.5 text-left text-xs font-black tracking-wide ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                    {lang === "ko" ? "환불 기준" : lang === "ja" ? "返金基準" : "Refund Policy"}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cancelPolicy[lang].map(([when, refund], i) => (
                                                <tr key={i} className={`border-t ${isDark ? "border-white/5 even:bg-slate-900/40" : "border-slate-100 even:bg-slate-50"}`}>
                                                    <td className={`px-5 py-4 font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                                                        {when}
                                                    </td>
                                                    <td className={`px-5 py-4 font-black ${isNoRefund(refund) ? "text-red-500" : "text-emerald-500"}`}>
                                                        {refund}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className={`mt-4 text-xs leading-6 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    {lang === "ko"
                                        ? "※ 위 취소 규정은 표준 약관 기준이며, 시즌 및 상품별로 달라질 수 있습니다. 정확한 내용은 예약 확정 시 별도 안내드립니다."
                                        : lang === "ja"
                                          ? "※ 上記の取消規定は標準約款に基づきます。シーズン・商品によって異なる場合があります。"
                                          : "※ Cancellation policy is based on standard terms and may vary by season or product. Full details provided upon booking confirmation."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── 오른쪽 사이드바 ── */}
                <aside className="lg:w-[300px] xl:w-[340px] shrink-0">
                    <div className="sticky top-24 flex flex-col gap-4">

                        {/* 가격 + 예약 카드 */}
                        <div className={`rounded-[24px] border p-5 shadow-sm sm:p-6 ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>

                            {/* 가격 */}
                            <div className="flex items-end justify-between gap-2">
                                <div>
                                    <div className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        {t.priceLabel}
                                    </div>
                                    <div className={`mt-0.5 text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {formatPrice(tour.price)}
                                    </div>
                                </div>
                                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                                    isDark ? "border-white/10 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-100 text-slate-600"
                                }`}>
                                    {tour.duration[lang]}
                                </span>
                            </div>

                            {/* 인원 선택 */}
                            <div className={`mt-4 rounded-[18px] border p-4 ${isDark ? "border-white/10 bg-slate-950" : "border-slate-100 bg-slate-50"}`}>
                                <div className={`mb-3 text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {t.guestsLabel}
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => setGuests(Math.max(1, guests - 1))}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg font-black transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.92] ${
                                            isDark ? "border-white/10 bg-slate-800 text-white hover:bg-slate-700" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                                        }`}
                                    >
                                        −
                                    </button>
                                    <span className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                        {guests}{lang === "ko" ? "명" : lang === "ja" ? "名" : " pax"}
                                    </span>
                                    <button
                                        onClick={() => setGuests(Math.min(20, guests + 1))}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg font-black transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.92] ${
                                            isDark ? "border-white/10 bg-slate-800 text-white hover:bg-slate-700" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
                                        }`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* 금액 요약 */}
                            <div className={`mt-3 rounded-[18px] border p-4 ${isDark ? "border-white/10 bg-slate-950" : "border-slate-100 bg-slate-50"}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.totalPrice}</span>
                                    <span className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between border-t pt-2 ${isDark ? 'border-white/5' : 'border-slate-200'}">
                                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.deposit}</span>
                                    <span className="text-sm font-black text-blue-500">{formatPrice(depositPrice)}</span>
                                </div>
                            </div>

                            {/* CTA 버튼 */}
                            <div className="mt-4 flex flex-col gap-2.5">
                                <Link
                                    href={`/booking?tour=${tour.id}&guests=${guests}`}
                                    className="flex items-center justify-center rounded-[18px] bg-blue-600 px-5 py-4 text-base font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[2px] hover:bg-blue-500 hover:shadow-[0_14px_30px_rgba(37,99,235,0.36)] active:scale-[0.97] active:translate-y-0"
                                >
                                    {t.reserve}
                                </Link>
                                <Link
                                    href="/contact"
                                    className={`flex items-center justify-center rounded-[18px] border px-5 py-3.5 text-sm font-bold transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.97] active:translate-y-0 ${
                                        isDark
                                            ? "border-white/10 bg-slate-800 text-slate-100 hover:bg-slate-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {lang === "ko" ? "상담 문의" : lang === "ja" ? "お問い合わせ" : "Inquire"}
                                </Link>
                            </div>
                        </div>

                        {/* 상품 정보 */}
                        <div className={`rounded-[24px] border p-5 ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>
                            <h3 className={`mb-4 text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                {lang === "ko" ? "상품 정보" : lang === "ja" ? "商品情報" : "Tour Info"}
                            </h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    {
                                        label: lang === "ko" ? "지역" : lang === "ja" ? "地域" : "Region",
                                        value: region,
                                    },
                                    {
                                        label: lang === "ko" ? "테마" : lang === "ja" ? "テーマ" : "Theme",
                                        value: themeLabel,
                                    },
                                    {
                                        label: lang === "ko" ? "기간" : lang === "ja" ? "期間" : "Duration",
                                        value: tour.duration[lang],
                                    },
                                    {
                                        label: lang === "ko" ? "예약금" : lang === "ja" ? "予約金" : "Deposit",
                                        value: formatPrice(tour.deposit),
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label} className={`flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                                        <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
                                        <span className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 다른 투어 보기 */}
                        <Link
                            href="/tours"
                            className={`flex items-center justify-center gap-2 rounded-[20px] border px-5 py-4 text-sm font-bold transition-[background-color,transform] duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.97] ${
                                isDark ? "border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            ← {lang === "ko" ? "다른 투어 보기" : lang === "ja" ? "他のツアーを見る" : "Browse other tours"}
                        </Link>
                    </div>
                </aside>
            </div>
        </>
    );
}

export default function TourDetailPage() {
    return (
        <PageShell activeKey="tours">
            <TourDetailContent />
        </PageShell>
    );
}
