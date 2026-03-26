"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/bluewolf-data";
import { formatPrice } from "@/lib/bluewolf-utils";
import { PageShell, usePage } from "@/components/layout/PageShell";
import { Dropdown } from "@/components/ui/Dropdown";

/* ─── Mock booking data (demo) ─────────────────────────── */
const DEMO_BOOKING = {
    bookingNo: "BW-2025-0042",
    tour: tours[0],
    departDate: "2025-08-15",
    guests: 2,
    name: "홍길동",
    phone: "010-1234-5678",
    createdAt: "2025-03-20",
    status: "confirmed" as "confirmed" | "pending" | "cancelled",
};

/* ─── Static multilingual data ─────────────────────────── */
const text = {
    ko: {
        badge: "예약 관리",
        title: "예약 확인 · 취소",
        desc: "예약 번호와 예약자 이름을 입력하면 예약 내역을 확인하고 취소를 신청할 수 있습니다.",
        bookingNo: "예약 번호",
        bookingNoPlaceholder: "예: BW-2025-0042",
        nameLabel: "예약자 이름",
        namePlaceholder: "홍길동",
        searchBtn: "조회하기",
        notFoundTitle: "조회된 예약이 없습니다",
        notFoundDesc: "예약 번호와 이름을 다시 확인해주세요.",
        bookingInfo: "예약 정보",
        bookingNoLabel: "예약 번호",
        tourLabel: "여행 상품",
        departLabel: "출발일",
        guestsLabel: "인원",
        statusLabel: "예약 상태",
        totalLabel: "총 여행 금액",
        depositLabel: "납부 예약금",
        remainLabel: "잔금",
        createdLabel: "예약 접수일",
        statusConfirmed: "예약 확정",
        statusPending: "승인 대기",
        statusCancelled: "취소 완료",
        cancelBtn: "취소 신청",
        detailBtn: "상품 상세보기",
        cancelTitle: "예약 취소 신청",
        policyTitle: "환불 규정",
        policyHeaders: ["취소 시점", "환불 금액"],
        policyRows: [
            ["출발 30일 전 이상", "전액 환불"],
            ["출발 20~29일 전", "예약금 제외 환불"],
            ["출발 10~19일 전", "여행 요금의 50% 환불"],
            ["출발 7~9일 전", "여행 요금의 30% 환불"],
            ["출발 7일 미만", "환불 불가"],
        ] as [string, string][],
        cancelReasonLabel: "취소 사유",
        cancelReasons: [
            "개인 사정",
            "일정 변경",
            "건강 문제",
            "여행지 변경",
            "비용 문제",
            "기타",
        ],
        cancelMemoLabel: "추가 메모 (선택)",
        cancelMemoPlaceholder: "취소와 관련한 추가 내용을 적어주세요.",
        submitBtn: "취소 신청 완료",
        backBtn: "돌아가기",
        doneTitle: "취소 신청이 접수되었습니다",
        doneDesc: "영업일 기준 1~2일 내에 확인 후 환불 안내를 드립니다.\n취소 신청 내역은 이메일 또는 문자로 발송됩니다.",
        doneBack: "처음으로 돌아가기",
        guests: (n: number) => `${n}명`,
        person: "인",
    },
    ja: {
        badge: "予約管理",
        title: "予約確認・取消",
        desc: "予約番号と予約者名を入力すると、予約内容の確認とキャンセル申請ができます。",
        bookingNo: "予約番号",
        bookingNoPlaceholder: "例: BW-2025-0042",
        nameLabel: "予約者名",
        namePlaceholder: "山田太郎",
        searchBtn: "照会する",
        notFoundTitle: "予約が見つかりません",
        notFoundDesc: "予約番号とお名前を再度ご確認ください。",
        bookingInfo: "予約情報",
        bookingNoLabel: "予約番号",
        tourLabel: "ツアー",
        departLabel: "出発日",
        guestsLabel: "人数",
        statusLabel: "予約状態",
        totalLabel: "旅行合計金額",
        depositLabel: "支払済予約金",
        remainLabel: "残金",
        createdLabel: "予約受付日",
        statusConfirmed: "予約確定",
        statusPending: "承認待ち",
        statusCancelled: "キャンセル済",
        cancelBtn: "キャンセル申請",
        detailBtn: "商品詳細を見る",
        cancelTitle: "予約キャンセル申請",
        policyTitle: "返金規定",
        policyHeaders: ["キャンセル時点", "返金額"],
        policyRows: [
            ["出発30日以上前", "全額返金"],
            ["出発20〜29日前", "予約金を除き返金"],
            ["出発10〜19日前", "旅行料金の50%返金"],
            ["出発7〜9日前", "旅行料金の30%返金"],
            ["出発7日未満", "返金不可"],
        ] as [string, string][],
        cancelReasonLabel: "キャンセル理由",
        cancelReasons: ["個人都合", "日程変更", "健康上の問題", "目的地変更", "費用の問題", "その他"],
        cancelMemoLabel: "追記事項（任意）",
        cancelMemoPlaceholder: "キャンセルに関する追加情報をご記入ください。",
        submitBtn: "キャンセル申請を完了",
        backBtn: "戻る",
        doneTitle: "キャンセル申請を受け付けました",
        doneDesc: "営業日1〜2日以内に確認の上、返金案内をお送りします。\nキャンセル内容はメールまたはSMSで送信されます。",
        doneBack: "最初に戻る",
        guests: (n: number) => `${n}名`,
        person: "名",
    },
    en: {
        badge: "Booking Management",
        title: "Booking Lookup & Cancellation",
        desc: "Enter your booking number and name to view your booking details or request a cancellation.",
        bookingNo: "Booking Number",
        bookingNoPlaceholder: "e.g. BW-2025-0042",
        nameLabel: "Lead Traveler Name",
        namePlaceholder: "John Doe",
        searchBtn: "Look up",
        notFoundTitle: "No booking found",
        notFoundDesc: "Please check your booking number and name and try again.",
        bookingInfo: "Booking Details",
        bookingNoLabel: "Booking No.",
        tourLabel: "Tour",
        departLabel: "Departure",
        guestsLabel: "Guests",
        statusLabel: "Status",
        totalLabel: "Total price",
        depositLabel: "Deposit paid",
        remainLabel: "Balance due",
        createdLabel: "Booked on",
        statusConfirmed: "Confirmed",
        statusPending: "Pending",
        statusCancelled: "Cancelled",
        cancelBtn: "Request cancellation",
        detailBtn: "View tour details",
        cancelTitle: "Cancellation Request",
        policyTitle: "Refund Policy",
        policyHeaders: ["Cancellation timing", "Refund amount"],
        policyRows: [
            ["30+ days before departure", "Full refund"],
            ["20–29 days before", "Refund minus deposit"],
            ["10–19 days before", "50% refund"],
            ["7–9 days before", "30% refund"],
            ["Under 7 days", "No refund"],
        ] as [string, string][],
        cancelReasonLabel: "Reason for cancellation",
        cancelReasons: ["Personal reasons", "Schedule change", "Health issue", "Change of destination", "Budget concerns", "Other"],
        cancelMemoLabel: "Additional notes (optional)",
        cancelMemoPlaceholder: "Please share any additional details about your cancellation.",
        submitBtn: "Submit cancellation",
        backBtn: "Go back",
        doneTitle: "Cancellation request received",
        doneDesc: "We will process your request within 1–2 business days and send a refund confirmation.\nDetails will be sent via email or SMS.",
        doneBack: "Back to start",
        guests: (n: number) => `${n} guests`,
        person: "person",
    },
};

/* ─── State types ───────────────────────────────────────── */
type SearchState = "idle" | "found" | "not-found" | "cancel-form" | "cancel-done";

/* ─── Shared style helpers ──────────────────────────────── */
const card = (isDark: boolean) =>
    `rounded-[24px] border p-5 sm:rounded-[28px] sm:p-7 transition-colors duration-300 ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
    }`;


const inputClass = (isDark: boolean) =>
    `h-12 sm:h-14 w-full rounded-2xl border px-4 sm:px-5 text-[15px] sm:text-[16px] font-semibold outline-none transition-[border-color,box-shadow,background-color] duration-700 ease-in-out focus:border-blue-400 focus:ring-4 ${
        isDark
            ? "border-white/10 bg-slate-950 text-slate-100 focus:ring-blue-900/30 focus:bg-slate-900 placeholder:text-slate-500"
            : "border-slate-200 bg-slate-50 text-slate-900 focus:ring-blue-50 focus:bg-white placeholder:text-slate-400"
    }`;

const labelClass = (isDark: boolean) =>
    `text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-800"}`;

const mutedClass = (isDark: boolean) =>
    `text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`;

const primaryBtn =
    "group relative overflow-hidden rounded-2xl bg-blue-600 px-6 py-3 sm:py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[3px] hover:bg-blue-500 hover:shadow-[0_14px_28px_rgba(37,99,235,0.32)] active:scale-[0.99] active:translate-y-0";

const ghostBtn = (isDark: boolean) =>
    `group relative overflow-hidden rounded-2xl border px-6 py-3 sm:py-3.5 font-bold transition-[transform,background-color,border-color] duration-700 ease-in-out hover:-translate-y-[3px] active:scale-[0.97] active:translate-y-0 ${
        isDark
            ? "border-white/10 bg-slate-800 text-slate-100 hover:bg-slate-700"
            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
    }`;

const dangerBtn =
    "group relative overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-6 py-3 sm:py-3.5 font-bold text-red-600 transition-[transform,background-color] duration-700 ease-in-out hover:-translate-y-[3px] hover:bg-red-100 active:scale-[0.97] active:translate-y-0";

const shineSpan =
    "pointer-events-none absolute inset-y-0 left-[-30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[120%] group-hover:opacity-100";

/* ─── Status badge ──────────────────────────────────────── */
function StatusBadge({ status, tx }: { status: string; tx: (typeof text)["ko"] }) {
    const map = {
        confirmed: { label: tx.statusConfirmed, cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        pending: { label: tx.statusPending, cls: "bg-amber-100 text-amber-700 border-amber-200" },
        cancelled: { label: tx.statusCancelled, cls: "bg-red-100 text-red-600 border-red-200" },
    };
    const item = map[status as keyof typeof map] ?? map.pending;
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${item.cls}`}>
            {item.label}
        </span>
    );
}

/* ─── Main content ──────────────────────────────────────── */
function BookingLookupContent() {
    const { lang, isDark } = usePage();
    const tx = text[lang];

    const [bookingNo, setBookingNo] = useState("");
    const [name, setName] = useState("");
    const [state, setState] = useState<SearchState>("idle");
    const [cancelReason, setCancelReason] = useState("");
    const [cancelMemo, setCancelMemo] = useState("");

    const booking = DEMO_BOOKING;
    const tour = booking.tour;
    const totalPrice = tour.price * booking.guests;
    const depositPrice = tour.deposit * booking.guests;
    const remain = totalPrice - depositPrice;

    function handleSearch(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!bookingNo.trim() || !name.trim()) return;
        // Demo: any input shows the mock booking
        setState("found");
    }

    function handleReset() {
        setBookingNo("");
        setName("");
        setCancelReason("");
        setCancelMemo("");
        setState("idle");
    }

    function handleCancelSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setState("cancel-done");
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 sm:gap-6">
            {/* ── Page heading ── */}
            <div>
                <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black text-blue-600">
                    {tx.badge}
                </span>
                <h1
                    className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${
                        isDark ? "text-white" : "text-slate-900"
                    }`}
                >
                    {tx.title}
                </h1>
                <p className={`mt-2 text-sm leading-7 sm:text-base ${mutedClass(isDark)}`}>{tx.desc}</p>
            </div>

            {/* ── Lookup form ── */}
            <div className={card(isDark)}>
                <form onSubmit={handleSearch} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2">
                            <span className={labelClass(isDark)}>{tx.bookingNo}</span>
                            <input
                                value={bookingNo}
                                onChange={(e) => setBookingNo(e.target.value)}
                                placeholder={tx.bookingNoPlaceholder}
                                className={inputClass(isDark)}
                            />
                        </label>
                        <label className="grid gap-2">
                            <span className={labelClass(isDark)}>{tx.nameLabel}</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={tx.namePlaceholder}
                                className={inputClass(isDark)}
                            />
                        </label>
                    </div>
                    <button type="submit" className={`${primaryBtn} w-full`}>
                        <span className={shineSpan} />
                        <span className="relative z-10">{tx.searchBtn}</span>
                    </button>
                </form>
            </div>

            {/* ── Not found ── */}
            {state === "not-found" && (
                <div
                    className={`flex flex-col items-center gap-3 rounded-[24px] border py-10 text-center ${
                        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                    }`}
                    style={{ animation: "apple-pop-in 300ms cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    <span className="text-4xl">🔍</span>
                    <p className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                        {tx.notFoundTitle}
                    </p>
                    <p className={mutedClass(isDark)}>{tx.notFoundDesc}</p>
                </div>
            )}

            {/* ── Booking result ── */}
            {(state === "found" || state === "cancel-form") && (
                <div
                    className={card(isDark)}
                    style={{ animation: "apple-pop-in 320ms cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    {/* Tour image */}
                    <div className="relative mb-5 overflow-hidden rounded-[20px]" style={{ aspectRatio: "16/7" }}>
                        <Image
                            src={tour.heroImage}
                            alt={tour.title[lang]}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 672px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                            {tour.tags[lang].slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/25 bg-white/14 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="absolute right-3 top-3">
                            <StatusBadge status={booking.status} tx={tx} />
                        </div>
                    </div>

                    {/* Section heading */}
                    <h2
                        className={`text-lg font-black tracking-tight sm:text-xl ${
                            isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                        {tx.bookingInfo}
                    </h2>

                    {/* Info rows */}
                    <div className={`mt-4 divide-y rounded-[20px] border ${isDark ? "divide-white/5 border-white/10 bg-slate-950" : "divide-slate-100 border-slate-200 bg-slate-50"}`}>
                        {[
                            [tx.bookingNoLabel, booking.bookingNo],
                            [tx.tourLabel, tour.title[lang]],
                            [tx.departLabel, booking.departDate],
                            [tx.guestsLabel, tx.guests(booking.guests)],
                            [tx.createdLabel, booking.createdAt],
                        ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                                <span className={`text-sm font-semibold ${mutedClass(isDark)}`}>{label}</span>
                                <span className={`text-sm font-black text-right ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Price breakdown */}
                    <div className={`mt-4 rounded-[20px] border p-4 sm:p-5 ${isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
                        {[
                            { label: tx.totalLabel, value: formatPrice(totalPrice), bold: false },
                            { label: tx.depositLabel, value: formatPrice(depositPrice), bold: false },
                        ].map(({ label, value }) => (
                            <div key={label} className={`flex items-center justify-between py-2 text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                <span>{label}</span>
                                <span>{value}</span>
                            </div>
                        ))}
                        <div
                            className={`mt-2 flex items-center justify-between border-t pt-3 text-base font-black ${
                                isDark ? "border-white/10 text-white" : "border-slate-300 text-slate-900"
                            }`}
                        >
                            <span>{tx.remainLabel}</span>
                            <span className="text-blue-600">{formatPrice(remain)}</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    {state === "found" && booking.status !== "cancelled" && (
                        <div className="mt-5 flex flex-wrap gap-3">
                            <button
                                onClick={() => { setCancelReason(tx.cancelReasons[0]); setState("cancel-form"); }}
                                className={dangerBtn}
                            >
                                <span className={shineSpan} />
                                <span className="relative z-10">{tx.cancelBtn}</span>
                            </button>
                            <Link href={`/tours/${tour.id}`} className={ghostBtn(isDark)}>
                                <span className="relative z-10">{tx.detailBtn}</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* ── Cancellation form ── */}
            {state === "cancel-form" && (
                <div
                    className={card(isDark)}
                    style={{ animation: "apple-pop-in 300ms cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    <h2 className={`text-lg font-black tracking-tight sm:text-xl ${isDark ? "text-white" : "text-slate-900"}`}>
                        {tx.cancelTitle}
                    </h2>

                    {/* Refund policy table */}
                    <div className="mt-4">
                        <p className={`mb-3 text-sm font-extrabold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                            {tx.policyTitle}
                        </p>
                        <div className={`overflow-hidden rounded-[18px] border ${isDark ? "border-white/10" : "border-slate-200"}`}>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={isDark ? "bg-slate-800" : "bg-slate-100"}>
                                        {tx.policyHeaders.map((h) => (
                                            <th
                                                key={h}
                                                className={`px-4 py-2.5 text-left font-black ${
                                                    isDark ? "text-slate-200" : "text-slate-700"
                                                }`}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                                    {tx.policyRows.map(([timing, refund], i) => (
                                        <tr key={i} className={isDark ? "bg-slate-950" : "bg-white"}>
                                            <td className={`px-4 py-3 font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                                                {timing}
                                            </td>
                                            <td
                                                className={`px-4 py-3 font-black ${
                                                    refund.includes("불가") || refund.includes("No refund") || refund.includes("返金不可")
                                                        ? "text-red-500"
                                                        : refund.includes("전액") || refund.includes("Full") || refund.includes("全額")
                                                        ? "text-emerald-600"
                                                        : isDark ? "text-slate-200" : "text-slate-800"
                                                }`}
                                            >
                                                {refund}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Cancellation form */}
                    <form onSubmit={handleCancelSubmit} className="mt-5 grid gap-4">
                        <div className="grid gap-2">
                            <span className={labelClass(isDark)}>{tx.cancelReasonLabel}</span>
                            <Dropdown
                                value={cancelReason || tx.cancelReasons[0]}
                                options={tx.cancelReasons.map((r) => ({ value: r, label: r }))}
                                onChange={(v) => setCancelReason(v)}
                                isDark={isDark}
                            />
                        </div>

                        <label className="grid gap-2">
                            <span className={labelClass(isDark)}>{tx.cancelMemoLabel}</span>
                            <textarea
                                value={cancelMemo}
                                onChange={(e) => setCancelMemo(e.target.value)}
                                placeholder={tx.cancelMemoPlaceholder}
                                rows={3}
                                className={`w-full rounded-2xl border px-4 py-3 text-[15px] font-semibold outline-none transition-[border-color,box-shadow,background-color] duration-700 ease-in-out focus:border-blue-400 focus:ring-4 resize-none ${
                                    isDark
                                        ? "border-white/10 bg-slate-950 text-slate-100 focus:ring-blue-900/30 focus:bg-slate-900 placeholder:text-slate-500"
                                        : "border-slate-200 bg-slate-50 text-slate-900 focus:ring-blue-50 focus:bg-white placeholder:text-slate-400"
                                }`}
                            />
                        </label>

                        <div className="flex flex-wrap gap-3">
                            <button type="submit" className={`${primaryBtn} !bg-red-600 !shadow-[0_10px_24px_rgba(220,38,38,0.22)] hover:!bg-red-500 hover:!shadow-[0_14px_28px_rgba(220,38,38,0.32)]`}>
                                <span className={shineSpan} />
                                <span className="relative z-10">{tx.submitBtn}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setState("found")}
                                className={ghostBtn(isDark)}
                            >
                                <span className="relative z-10">{tx.backBtn}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Cancellation complete ── */}
            {state === "cancel-done" && (
                <div
                    className={`flex flex-col items-center gap-4 rounded-[24px] border py-12 text-center ${
                        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
                    }`}
                    style={{ animation: "apple-pop-in 320ms cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div>
                        <p className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                            {tx.doneTitle}
                        </p>
                        <p className={`mt-2 max-w-sm text-sm leading-7 whitespace-pre-line ${mutedClass(isDark)}`}>
                            {tx.doneDesc}
                        </p>
                    </div>
                    <button onClick={handleReset} className={primaryBtn}>
                        <span className={shineSpan} />
                        <span className="relative z-10">{tx.doneBack}</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default function BookingPage() {
    return (
        <PageShell activeKey="booking">
            <Suspense>
                <BookingLookupContent />
            </Suspense>
        </PageShell>
    );
}
