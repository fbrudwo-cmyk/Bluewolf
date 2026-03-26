"use client";

import { useState } from "react";
import { PageShell, usePage } from "@/components/layout/PageShell";

const contactData = {
    ko: {
        title: "문의하기",
        desc: "궁금한 점이나 예약 상담이 필요하시면 아래 양식을 통해 연락해주세요. 24시간 이내 답변드립니다.",
        nameLabel: "이름",
        namePlaceholder: "홍길동",
        emailLabel: "이메일",
        emailPlaceholder: "example@email.com",
        phoneLabel: "연락처",
        phonePlaceholder: "010-0000-0000",
        subjectLabel: "문의 유형",
        subjects: ["투어 상품 문의", "예약 상담", "결제 관련", "기타"],
        messageLabel: "문의 내용",
        messagePlaceholder: "궁금하신 내용을 자유롭게 작성해주세요.",
        submitBtn: "문의 보내기",
        submitSuccess: "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
        infoTitle: "연락처 정보",
        infoEmail: "이메일",
        infoPhone: "전화",
        infoHours: "운영 시간",
        infoAddress: "주소",
        emailValue: "contact@bluewolf.kr",
        phoneValue: "+82-2-0000-0000",
        hoursValue: "평일 09:00 – 18:00 (KST)",
        addressValue: "서울특별시 강남구 테헤란로 123",
        kakaoBtn: "카카오톡 채널",
        kakaoDesc: "카카오톡으로 빠르게 상담받으세요.",
    },
    ja: {
        title: "お問い合わせ",
        desc: "ご不明な点や予約相談は下記のフォームからご連絡ください。24時間以内にご返答いたします。",
        nameLabel: "お名前",
        namePlaceholder: "山田 太郎",
        emailLabel: "メールアドレス",
        emailPlaceholder: "example@email.com",
        phoneLabel: "電話番号",
        phonePlaceholder: "090-0000-0000",
        subjectLabel: "お問い合わせの種類",
        subjects: ["ツアー商品について", "予約相談", "お支払いについて", "その他"],
        messageLabel: "お問い合わせ内容",
        messagePlaceholder: "ご質問・ご要望をご自由にご記入ください。",
        submitBtn: "送信する",
        submitSuccess: "お問い合わせを受け付けました。早急にご連絡いたします。",
        infoTitle: "連絡先情報",
        infoEmail: "メール",
        infoPhone: "電話",
        infoHours: "営業時間",
        infoAddress: "住所",
        emailValue: "contact@bluewolf.kr",
        phoneValue: "+82-2-0000-0000",
        hoursValue: "平日 09:00 – 18:00 (KST)",
        addressValue: "ソウル特別市 江南区 テヘラン路 123",
        kakaoBtn: "LINEで相談",
        kakaoDesc: "LINEで素早く相談できます。",
    },
    en: {
        title: "Contact us",
        desc: "Have a question or need a booking consultation? Send us a message and we'll get back to you within 24 hours.",
        nameLabel: "Full name",
        namePlaceholder: "John Doe",
        emailLabel: "Email address",
        emailPlaceholder: "example@email.com",
        phoneLabel: "Phone number",
        phonePlaceholder: "+1 000-000-0000",
        subjectLabel: "Inquiry type",
        subjects: ["Tour inquiry", "Booking consultation", "Payment issue", "Other"],
        messageLabel: "Message",
        messagePlaceholder: "Tell us what you'd like to know.",
        submitBtn: "Send message",
        submitSuccess: "Your inquiry has been submitted. We'll be in touch soon.",
        infoTitle: "Contact information",
        infoEmail: "Email",
        infoPhone: "Phone",
        infoHours: "Business hours",
        infoAddress: "Address",
        emailValue: "contact@bluewolf.kr",
        phoneValue: "+82-2-0000-0000",
        hoursValue: "Mon–Fri 09:00 – 18:00 KST",
        addressValue: "123 Teheran-ro, Gangnam-gu, Seoul",
        kakaoBtn: "KakaoTalk channel",
        kakaoDesc: "Chat with us on KakaoTalk for fast replies.",
    },
} as const;

const inputClass =
    "h-12 sm:h-14 w-full rounded-2xl border px-4 sm:px-5 text-[15px] sm:text-[16px] font-semibold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50";

function ContactContent() {
    const { lang, isDark } = usePage();
    const c = contactData[lang];

    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: c.subjects[0] as string, message: "" });
    const [submitted, setSubmitted] = useState(false);

    const inputTone = isDark
        ? "border-white/10 bg-slate-950 text-slate-100 focus:bg-slate-900"
        : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white";

    const sectionBase = `rounded-[24px] border p-4 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-7 ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
    }`;

    const labelClass = `text-sm font-extrabold ${isDark ? "text-slate-100" : "text-slate-900"}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
            {/* 문의 폼 */}
            <section className={sectionBase}>
                <h1 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                    {c.title}
                </h1>
                <p className={`mt-3 text-sm leading-7 sm:text-base ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                    {c.desc}
                </p>

                {submitted ? (
                    <div className="mt-8 rounded-[22px] border border-emerald-200 bg-emerald-50 p-6 text-center">
                        <div className="text-4xl">✓</div>
                        <p className="mt-3 font-bold text-emerald-700">{c.submitSuccess}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2">
                            <span className={labelClass}>{c.nameLabel}</span>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder={c.namePlaceholder}
                                className={`${inputClass} ${inputTone}`}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className={labelClass}>{c.emailLabel}</span>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder={c.emailPlaceholder}
                                className={`${inputClass} ${inputTone}`}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className={labelClass}>{c.phoneLabel}</span>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder={c.phonePlaceholder}
                                className={`${inputClass} ${inputTone}`}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className={labelClass}>{c.subjectLabel}</span>
                            <select
                                value={form.subject}
                                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                                className={`${inputClass} cursor-pointer appearance-none ${inputTone}`}
                            >
                                {c.subjects.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-2 md:col-span-2">
                            <span className={labelClass}>{c.messageLabel}</span>
                            <textarea
                                required
                                value={form.message}
                                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                placeholder={c.messagePlaceholder}
                                rows={5}
                                className={`w-full rounded-2xl border px-4 py-4 text-[15px] sm:px-5 sm:text-[16px] font-semibold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 ${inputTone}`}
                            />
                        </label>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="group relative overflow-hidden rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
                            >
                                {c.submitBtn}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            {/* 연락처 정보 */}
            <div className="flex flex-col gap-4">
                <section className={sectionBase}>
                    <h2 className={`text-xl font-black tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
                        {c.infoTitle}
                    </h2>

                    <div className="mt-5 grid gap-3">
                        {[
                            { icon: "✉️", label: c.infoEmail, value: c.emailValue },
                            { icon: "📞", label: c.infoPhone, value: c.phoneValue },
                            { icon: "🕐", label: c.infoHours, value: c.hoursValue },
                            { icon: "📍", label: c.infoAddress, value: c.addressValue },
                        ].map(({ icon, label, value }) => (
                            <div
                                key={label}
                                className={`flex gap-3 rounded-[20px] border p-4 ${
                                    isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"
                                }`}
                            >
                                <span className="mt-0.5 text-lg">{icon}</span>
                                <div>
                                    <div className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        {label}
                                    </div>
                                    <div className={`mt-0.5 text-sm font-semibold sm:text-base ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                                        {value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 카카오 채널 */}
                <section className="rounded-[24px] border border-yellow-300 bg-yellow-400 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500 text-2xl shadow-sm">
                            💬
                        </div>
                        <div>
                            <div className="font-black text-yellow-900">{c.kakaoBtn}</div>
                            <div className="mt-0.5 text-sm font-semibold text-yellow-800">{c.kakaoDesc}</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <PageShell activeKey="contact">
            <ContactContent />
        </PageShell>
    );
}
