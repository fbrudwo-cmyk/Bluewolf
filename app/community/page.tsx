"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { community, type CommunityItem, type CommunityTab, type Locale } from "@/lib/bluewolf-data";
import { PageShell, usePage } from "@/components/layout/PageShell";

// ─── 다국어 텍스트 ───────────────────────────────────────────────
const cx = {
    ko: {
        tabAll: "전체", tabReview: "후기", tabMate: "동행 찾기", tabQna: "질문",
        writeBtn: "글 작성하기", writeTitle: "새 글 작성",
        writeCancel: "취소", writeSubmit: "등록하기",
        typeLabel: "게시판 선택",
        typeReview: "후기", typeMate: "동행 찾기", typeQna: "질문",
        contentPlaceholder: "내용을 입력해주세요.",
        reviewPlaceholder: "여행 후기를 남겨주세요. 투어명, 일정, 느낀 점 등을 자유롭게 작성해보세요.",
        matePlaceholder: "동행을 찾고 있다면 투어명, 출발일, 모집 인원, 연락 방법 등을 적어주세요.",
        qnaPlaceholder: "궁금한 점을 자유롭게 질문해주세요. BlueWolf 운영팀이 답변해드립니다.",
        tourNameLabel: "투어명", tourNamePlaceholder: "예: 고비 사막 5박 6일",
        travelDateLabel: "출발일", travelDatePlaceholder: "예: 2025-08-15",
        maxPeopleLabel: "모집 인원",
        ratingLabel: "별점",
        noItems: "아직 게시글이 없습니다.",
        likes: "좋아요", comments: "댓글",
        commentPlaceholder: "댓글을 입력하세요...",
        commentSubmit: "등록",
        answered: "답변완료", unanswered: "답변대기",
        people: "명",
        recruiting: "모집중",
        full: "모집완료",
        ratingStars: ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"],
        boardTitle: { review: "후기 게시판", mate: "동행 찾기 게시판", qna: "질문 게시판" },
        boardDesc: {
            review: "몽골 여행 경험을 공유해주세요.",
            mate: "함께 여행할 동행을 찾아보세요.",
            qna: "궁금한 점을 BlueWolf에게 물어보세요.",
        },
        photoLabel: "사진 첨부",
        photoDrop: "클릭하거나 사진을 여기에 드래그하세요",
        photoRemaining: "장 더 추가 가능",
        photoRemove: "사진 삭제",
    },
    ja: {
        tabAll: "すべて", tabReview: "レビュー", tabMate: "同行募集", tabQna: "質問",
        writeBtn: "投稿する", writeTitle: "新規投稿",
        writeCancel: "キャンセル", writeSubmit: "投稿",
        typeLabel: "掲示板選択",
        typeReview: "レビュー", typeMate: "同行募集", typeQna: "質問",
        contentPlaceholder: "内容を入力してください。",
        reviewPlaceholder: "旅行の感想をご記入ください。ツアー名、日程、感じたことなど自由にどうぞ。",
        matePlaceholder: "同行者を探している場合は、ツアー名・出発日・募集人数・連絡方法などをご記入ください。",
        qnaPlaceholder: "気になることを自由に質問してください。BlueWolfのスタッフがお答えします。",
        tourNameLabel: "ツアー名", tourNamePlaceholder: "例: ゴビ砂漠 5泊6日",
        travelDateLabel: "出発日", travelDatePlaceholder: "例: 2025-08-15",
        maxPeopleLabel: "募集人数",
        ratingLabel: "評価",
        noItems: "まだ投稿がありません。",
        likes: "いいね", comments: "コメント",
        commentPlaceholder: "コメントを入力...",
        commentSubmit: "投稿",
        answered: "回答済", unanswered: "回答待ち",
        people: "名",
        recruiting: "募集中",
        full: "募集終了",
        ratingStars: ["とても悪い", "悪い", "普通", "良い", "とても良い"],
        boardTitle: { review: "レビュー掲示板", mate: "同行募集掲示板", qna: "質問掲示板" },
        boardDesc: {
            review: "モンゴル旅行の体験をシェアしてください。",
            mate: "一緒に旅行する同行者を探しましょう。",
            qna: "気になることをBlueWolfにお気軽に聞いてください。",
        },
        photoLabel: "写真を添付",
        photoDrop: "クリックまたは写真をドラッグ",
        photoRemaining: "枚追加可能",
        photoRemove: "削除",
    },
    en: {
        tabAll: "All", tabReview: "Reviews", tabMate: "Find Companions", tabQna: "Q&A",
        writeBtn: "Write post", writeTitle: "New post",
        writeCancel: "Cancel", writeSubmit: "Submit",
        typeLabel: "Board",
        typeReview: "Review", typeMate: "Find Companion", typeQna: "Question",
        contentPlaceholder: "Enter your message.",
        reviewPlaceholder: "Share your travel experience. Feel free to write about the tour, schedule, and impressions.",
        matePlaceholder: "Looking for travel companions? Include tour name, departure date, group size, and contact info.",
        qnaPlaceholder: "Ask anything! The BlueWolf team will answer your questions.",
        tourNameLabel: "Tour name", tourNamePlaceholder: "e.g. Gobi Desert 5N6D",
        travelDateLabel: "Departure", travelDatePlaceholder: "e.g. 2025-08-15",
        maxPeopleLabel: "Group size",
        ratingLabel: "Rating",
        noItems: "No posts yet.",
        likes: "Likes", comments: "Comments",
        commentPlaceholder: "Write a comment...",
        commentSubmit: "Post",
        answered: "Answered", unanswered: "Pending",
        people: " people",
        recruiting: "Open",
        full: "Full",
        ratingStars: ["Very bad", "Bad", "Average", "Good", "Excellent"],
        boardTitle: { review: "Review Board", mate: "Companion Board", qna: "Q&A Board" },
        boardDesc: {
            review: "Share your Mongolia travel experience.",
            mate: "Find companions for your upcoming trip.",
            qna: "Ask BlueWolf anything about your trip.",
        },
        photoLabel: "Attach photos",
        photoDrop: "Click or drag photos here",
        photoRemaining: " more photos allowed",
        photoRemove: "Remove",
    },
} as const;

// ─── 유틸 ────────────────────────────────────────────────────────
const typeBadge: Record<Exclude<CommunityTab, "all">, string> = {
    review: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    mate: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    qna: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const sz = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`${sz} ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ─── 글 작성 폼 ────────────────────────────────────────────────────
function WriteForm({
    isDark,
    h,
    defaultType,
    onClose,
}: {
    isDark: boolean;
    h: (typeof cx)[Locale];
    defaultType: Exclude<CommunityTab, "all">;
    onClose: () => void;
}) {
    const [formType, setFormType] = useState<Exclude<CommunityTab, "all">>(defaultType);
    const [formText, setFormText] = useState("");
    const [tourName, setTourName] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [maxPeople, setMaxPeople] = useState("4");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_PHOTOS = 5;

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const remaining = MAX_PHOTOS - previews.length;
        const urls = imgs.slice(0, remaining).map((f) => URL.createObjectURL(f));
        setPreviews((prev) => [...prev, ...urls]);
    };

    const removePhoto = (index: number) => {
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const inputClass = `w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 ${
        isDark
            ? "border-white/10 bg-slate-900 text-slate-100 placeholder:text-slate-500"
            : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
    }`;

    const placeholder =
        formType === "review" ? h.reviewPlaceholder
        : formType === "mate" ? h.matePlaceholder
        : h.qnaPlaceholder;

    return (
        <div className={`mt-5 rounded-[22px] border p-5 ${isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-slate-50"}`}>
            <h2 className={`mb-4 text-base font-black ${isDark ? "text-white" : "text-slate-900"}`}>{h.writeTitle}</h2>

            {/* 게시판 선택 */}
            <div className="mb-4">
                <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.typeLabel}</p>
                <div className="flex gap-2">
                    {(["review", "mate", "qna"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFormType(type)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                                formType === type
                                    ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                                    : isDark
                                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {type === "review" ? h.typeReview : type === "mate" ? h.typeMate : h.typeQna}
                        </button>
                    ))}
                </div>
            </div>

            {/* 후기: 별점 */}
            {formType === "review" && (
                <div className="mb-4">
                    <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.ratingLabel}</p>
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                key={i}
                                onMouseEnter={() => setHoverRating(i + 1)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(i + 1)}
                                className="transition-transform hover:scale-110"
                            >
                                <svg className={`h-7 w-7 ${i < (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                        <span className={`ml-2 self-center text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {h.ratingStars[(hoverRating || rating) - 1]}
                        </span>
                    </div>
                </div>
            )}

            {/* 후기/동행: 투어명 */}
            {(formType === "review" || formType === "mate") && (
                <div className="mb-4">
                    <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.tourNameLabel}</p>
                    <input
                        value={tourName}
                        onChange={(e) => setTourName(e.target.value)}
                        placeholder={h.tourNamePlaceholder}
                        className={inputClass}
                    />
                </div>
            )}

            {/* 동행: 출발일, 모집인원 */}
            {formType === "mate" && (
                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div>
                        <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.travelDateLabel}</p>
                        <input
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            placeholder={h.travelDatePlaceholder}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.maxPeopleLabel}</p>
                        <input
                            type="number"
                            min={2}
                            max={20}
                            value={maxPeople}
                            onChange={(e) => setMaxPeople(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>
            )}

            {/* 후기: 사진 첨부 */}
            {formType === "review" && (
                <div className="mb-4">
                    <p className={`mb-2 text-xs font-extrabold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {h.photoLabel}
                        <span className={`ml-2 font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                            ({previews.length}/{MAX_PHOTOS})
                        </span>
                    </p>

                    {/* 미리보기 그리드 */}
                    {previews.length > 0 && (
                        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {previews.map((url, i) => (
                                <div key={i} className="group relative aspect-square overflow-hidden rounded-[14px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt="" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        title={h.photoRemove}
                                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 업로드 영역 */}
                    {previews.length < MAX_PHOTOS && (
                        <div
                            role="button"
                            tabIndex={0}
                            className={`cursor-pointer rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                                isDragging
                                    ? isDark ? "border-blue-400 bg-blue-500/10" : "border-blue-400 bg-blue-50"
                                    : isDark ? "border-white/20 hover:border-blue-400/50 hover:bg-white/5" : "border-slate-300 hover:border-blue-300 hover:bg-blue-50/50"
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleFiles(e.dataTransfer.files);
                            }}
                        >
                            <svg className={`mx-auto mb-2 h-8 w-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M3.75 3a.75.75 0 00-.75.75v14.5c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75H3.75zM12 8.25h.008v.008H12V8.25z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>{h.photoDrop}</p>
                            <p className={`mt-1 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                {MAX_PHOTOS - previews.length}{h.photoRemaining}
                            </p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                    />
                </div>
            )}

            {/* 본문 */}
            <textarea
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder={placeholder}
                className={`${inputClass} resize-none`}
                rows={4}
            />

            <div className="mt-3 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                        isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                >
                    {h.writeCancel}
                </button>
                <button
                    onClick={onClose}
                    className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                >
                    {h.writeSubmit}
                </button>
            </div>
        </div>
    );
}

// ─── 상세 모달 ─────────────────────────────────────────────────────
function DetailModal({
    item,
    isDark,
    h,
    onClose,
}: {
    item: CommunityItem;
    isDark: boolean;
    h: (typeof cx)[Locale];
    onClose: () => void;
}) {
    const [commentText, setCommentText] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.likes);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const panelBg = isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200";
    const textMuted = isDark ? "text-slate-400" : "text-slate-500";
    const textMain = isDark ? "text-white" : "text-slate-900";
    const commentBg = isDark ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-200";

    return (
        <div
            className="animate-fade-in-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className={`animate-slide-up-modal relative z-10 w-full max-w-2xl rounded-t-[28px] border p-6 shadow-2xl sm:rounded-[28px] sm:m-4 ${panelBg} max-h-[85vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                            {item.author[0]}
                        </div>
                        <div>
                            <p className={`text-sm font-black ${textMain}`}>{item.author}</p>
                            <p className={`text-xs ${textMuted}`}>{item.date}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`rounded-full p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                    >
                        <svg className={`h-5 w-5 ${textMuted}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 후기 별점 */}
                {item.type === "review" && item.rating && (
                    <div className="mt-4 flex items-center gap-2">
                        <StarRating rating={item.rating} size="md" />
                        <span className={`text-sm font-bold text-amber-500`}>{item.rating}.0</span>
                    </div>
                )}

                {/* 투어/날짜 배지 */}
                {(item.tourTitle || item.travelDate) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.tourTitle && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isDark ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
                                {item.tourTitle}
                            </span>
                        )}
                        {item.travelDate && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isDark ? "border-slate-600 bg-slate-800 text-slate-300" : "border-slate-200 bg-slate-100 text-slate-600"}`}>
                                📅 {item.travelDate}
                            </span>
                        )}
                        {item.type === "mate" && item.maxPeople && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                (item.currentPeople ?? 0) >= item.maxPeople
                                    ? isDark ? "border-slate-600 bg-slate-800 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-500"
                                    : isDark ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}>
                                👥 {item.currentPeople}/{item.maxPeople}{h.people}
                                {" · "}
                                {(item.currentPeople ?? 0) >= item.maxPeople ? h.full : h.recruiting}
                            </span>
                        )}
                        {item.type === "qna" && (
                            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                item.answered
                                    ? isDark ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : isDark ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}>
                                {item.answered ? `✓ ${h.answered}` : `⏳ ${h.unanswered}`}
                            </span>
                        )}
                    </div>
                )}

                {/* 본문 */}
                <p className={`mt-4 text-sm leading-7 sm:text-base ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {item.text}
                </p>

                {/* 첨부 사진 갤러리 */}
                {item.photos && item.photos.length > 0 && (
                    <div className="mt-5">
                        <div className={`grid gap-2 ${
                            item.photos.length === 1 ? "grid-cols-1"
                            : item.photos.length === 2 ? "grid-cols-2"
                            : "grid-cols-3"
                        }`}>
                            {item.photos.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => setLightboxIndex(i)}
                                    className={`group relative overflow-hidden rounded-[16px] ${
                                        item.photos!.length === 1 ? "aspect-video" : "aspect-square"
                                    } ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                                    {/* 4장 이상이면 마지막 칸에 +n 표시 */}
                                    {i === 2 && item.photos!.length > 3 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <span className="text-xl font-black text-white">+{item.photos!.length - 3}</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 좋아요 */}
                <div className="mt-5 flex items-center gap-3">
                    <button
                        onClick={() => { setLiked((v) => !v); setLikeCount((v) => liked ? v - 1 : v + 1); }}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                            liked
                                ? "border-blue-400 bg-blue-600 text-white"
                                : isDark ? "border-white/10 bg-slate-800 text-slate-300 hover:border-blue-400/50" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300"
                        }`}
                    >
                        <svg className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {h.likes} {likeCount}
                    </button>
                    <span className={`text-xs ${textMuted}`}>
                        💬 {h.comments} {item.comments?.length ?? 0}
                    </span>
                </div>

                {/* 댓글 목록 */}
                {(item.comments?.length ?? 0) > 0 && (
                    <div className="mt-5 flex flex-col gap-3">
                        {item.comments!.map((c, i) => (
                            <div key={i} className={`rounded-[16px] border p-4 ${commentBg}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                                            c.author === "BlueWolf"
                                                ? "bg-blue-600 text-white"
                                                : isDark ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700"
                                        }`}>
                                            {c.author[0]}
                                        </div>
                                        <span className={`text-xs font-black ${c.author === "BlueWolf" ? "text-blue-500" : textMain}`}>
                                            {c.author}
                                            {c.author === "BlueWolf" && (
                                                <span className="ml-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">운영</span>
                                            )}
                                        </span>
                                    </div>
                                    <span className={`text-[11px] ${textMuted}`}>{c.date}</span>
                                </div>
                                <p className={`mt-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{c.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* 댓글 입력 */}
                <div className="mt-4 flex gap-2">
                    <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={h.commentPlaceholder}
                        className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 ${
                            isDark
                                ? "border-white/10 bg-slate-950 text-slate-100 placeholder:text-slate-500"
                                : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        }`}
                    />
                    <button
                        onClick={() => setCommentText("")}
                        className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                    >
                        {h.commentSubmit}
                    </button>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && item.photos && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* 이전 */}
                    {lightboxIndex > 0 && (
                        <button
                            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((v) => (v ?? 1) - 1); }}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <img
                        src={item.photos[lightboxIndex]}
                        alt=""
                        className="max-h-[85vh] max-w-[90vw] rounded-[18px] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {/* 다음 */}
                    {lightboxIndex < item.photos.length - 1 && (
                        <button
                            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((v) => (v ?? 0) + 1); }}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    {/* 닫기 + 카운터 */}
                    <div className="absolute top-4 right-4 flex items-center gap-3">
                        <span className="text-sm font-bold text-white/70">{lightboxIndex + 1} / {item.photos.length}</span>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── 후기 카드 ─────────────────────────────────────────────────────
function ReviewCard({ item, isDark, h, onClick }: { item: CommunityItem; isDark: boolean; h: (typeof cx)[Locale]; onClick: () => void }) {
    const cardBg = isDark ? "border-white/10 bg-slate-950 hover:bg-slate-900" : "border-slate-200 bg-slate-50 hover:bg-white";
    return (
        <article
            className={`cursor-pointer rounded-[22px] border p-5 transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[2px] hover:shadow-md ${cardBg}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                        {item.author[0]}
                    </div>
                    <div>
                        <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{item.author}</p>
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{item.date}</p>
                    </div>
                </div>
                {item.rating && <StarRating rating={item.rating} />}
            </div>
            {item.tourTitle && (
                <p className={`mt-3 text-xs font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>📍 {item.tourTitle}</p>
            )}
            <p className={`mt-2 line-clamp-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.text}</p>

            {/* 사진 썸네일 미리보기 */}
            {item.photos && item.photos.length > 0 && (
                <div className={`mt-3 grid gap-1.5 ${item.photos.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
                    {item.photos.slice(0, 3).map((src, i) => (
                        <div key={i} className="relative overflow-hidden rounded-[10px] aspect-square">
                            <img src={src} alt="" className="h-full w-full object-cover" />
                            {i === 2 && item.photos!.length > 3 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[10px]">
                                    <span className="text-sm font-black text-white">+{item.photos!.length - 3}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className={`mt-3 flex items-center gap-3 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                <span>👍 {item.likes}</span>
                <span>💬 {item.comments?.length ?? 0}</span>
                {item.photos && item.photos.length > 0 && (
                    <span>📷 {item.photos.length}</span>
                )}
            </div>
        </article>
    );
}

// ─── 동행 카드 ─────────────────────────────────────────────────────
function MateCard({ item, isDark, h, onClick }: { item: CommunityItem; isDark: boolean; h: (typeof cx)[Locale]; onClick: () => void }) {
    const isFull = (item.currentPeople ?? 0) >= (item.maxPeople ?? 1);
    const cardBg = isDark ? "border-white/10 bg-slate-950 hover:bg-slate-900" : "border-slate-200 bg-slate-50 hover:bg-white";
    return (
        <article
            className={`cursor-pointer rounded-[22px] border p-5 transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[2px] hover:shadow-md ${cardBg}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
                        {item.author[0]}
                    </div>
                    <div>
                        <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{item.author}</p>
                        <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{item.date}</p>
                    </div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${
                    isFull
                        ? isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                        : isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                }`}>
                    {isFull ? h.full : h.recruiting}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {item.tourTitle && (
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${isDark ? "border-blue-500/30 text-blue-400" : "border-blue-200 text-blue-600"}`}>
                        {item.tourTitle}
                    </span>
                )}
                {item.travelDate && (
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${isDark ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                        📅 {item.travelDate}
                    </span>
                )}
                {item.travelRegion && (
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${isDark ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                        📍 {item.travelRegion}
                    </span>
                )}
            </div>

            {item.maxPeople && (
                <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                            {item.currentPeople}/{item.maxPeople}{h.people}
                        </span>
                        <span className={`font-bold ${isFull ? isDark ? "text-slate-400" : "text-slate-500" : isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                            {isFull ? h.full : `${(item.maxPeople - (item.currentPeople ?? 0))}${h.people} ${h.recruiting}`}
                        </span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                        <div
                            className={`h-full rounded-full transition-all ${isFull ? "bg-slate-400" : "bg-emerald-500"}`}
                            style={{ width: `${((item.currentPeople ?? 0) / item.maxPeople) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <p className={`mt-3 line-clamp-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.text}</p>
            <div className={`mt-3 flex items-center gap-3 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                <span>👍 {item.likes}</span>
                <span>💬 {item.comments?.length ?? 0}</span>
            </div>
        </article>
    );
}

// ─── Q&A 카드 ──────────────────────────────────────────────────────
function QnaCard({ item, isDark, h, onClick }: { item: CommunityItem; isDark: boolean; h: (typeof cx)[Locale]; onClick: () => void }) {
    const cardBg = isDark ? "border-white/10 bg-slate-950 hover:bg-slate-900" : "border-slate-200 bg-slate-50 hover:bg-white";
    return (
        <article
            className={`cursor-pointer rounded-[22px] border p-5 transition-[transform,background-color,box-shadow] duration-700 ease-in-out hover:-translate-y-[2px] hover:shadow-md ${cardBg}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-700">
                    Q
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-black leading-snug ${isDark ? "text-white" : "text-slate-900"}`}>
                            {item.author}
                        </p>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                            item.answered
                                ? isDark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                                : isDark ? "bg-amber-900/40 text-amber-400" : "bg-amber-50 text-amber-700"
                        }`}>
                            {item.answered ? `✓ ${h.answered}` : `⏳ ${h.unanswered}`}
                        </span>
                    </div>
                    <p className={`mt-1.5 line-clamp-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{item.text}</p>
                    <div className={`mt-3 flex items-center gap-3 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        <span>{item.date}</span>
                        <span>👍 {item.likes}</span>
                        <span>💬 {item.comments?.length ?? 0}</span>
                    </div>
                </div>
            </div>
            {/* 첫 번째 답변 미리보기 */}
            {item.answered && item.comments && item.comments.length > 0 && (
                <div className={`mt-3 flex gap-2.5 rounded-[14px] border p-3 ${isDark ? "border-blue-500/20 bg-blue-500/5" : "border-blue-100 bg-blue-50"}`}>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">A</div>
                    <p className={`line-clamp-2 text-xs leading-5 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
                        {item.comments[0].text}
                    </p>
                </div>
            )}
        </article>
    );
}

// ─── 메인 컨텐츠 ──────────────────────────────────────────────────
function CommunityContent() {
    const { lang, isDark } = usePage();
    const h = cx[lang];

    const [activeTab, setActiveTab] = useState<CommunityTab>("all");
    const [animKey, setAnimKey] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CommunityItem | null>(null);

    const handleTabChange = (tab: CommunityTab) => {
        setActiveTab(tab);
        setAnimKey((v) => v + 1);
    };

    const allItems = community[lang];
    const filteredItems = activeTab === "all" ? allItems : allItems.filter((item) => item.type === activeTab);

    const reviewItems = filteredItems.filter((i) => i.type === "review");
    const mateItems = filteredItems.filter((i) => i.type === "mate");
    const qnaItems = filteredItems.filter((i) => i.type === "qna");

    const sectionBase = `rounded-[24px] border shadow-sm transition-colors duration-300 sm:rounded-[28px] ${
        isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
    }`;

    const tabs: [CommunityTab, string][] = [
        ["all", h.tabAll],
        ["review", h.tabReview],
        ["mate", h.tabMate],
        ["qna", h.tabQna],
    ];

    const tabColors: Record<CommunityTab, string> = {
        all: "bg-blue-600 text-white shadow-[0_6px_16px_rgba(37,99,235,0.25)]",
        review: "bg-emerald-500 text-white shadow-[0_6px_16px_rgba(16,185,129,0.25)]",
        mate: "bg-violet-500 text-white shadow-[0_6px_16px_rgba(139,92,246,0.25)]",
        qna: "bg-amber-500 text-white shadow-[0_6px_16px_rgba(245,158,11,0.25)]",
    };

    const formDefaultType: Exclude<CommunityTab, "all"> =
        activeTab === "all" ? "review" : (activeTab as Exclude<CommunityTab, "all">);

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* 헤더 */}
                <div className={`animate-fade-up ${sectionBase} p-5 sm:p-7`} style={{ animationDelay: "0ms" }}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className={`text-2xl font-black tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                {activeTab === "all" ? "커뮤니티"
                                    : activeTab === "review" ? h.boardTitle.review
                                    : activeTab === "mate" ? h.boardTitle.mate
                                    : h.boardTitle.qna}
                            </h1>
                            <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                {activeTab === "all"
                                    ? (lang === "ko" ? "후기·동행·질문을 자유롭게 나눠보세요." : lang === "ja" ? "レビュー・同行・質問を自由に共有しましょう。" : "Share reviews, find companions, and ask questions.")
                                    : activeTab === "review" ? h.boardDesc.review
                                    : activeTab === "mate" ? h.boardDesc.mate
                                    : h.boardDesc.qna}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm((v) => !v)}
                            className="shrink-0 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.20)] transition hover:-translate-y-0.5 hover:bg-blue-500 active:scale-[0.98]"
                        >
                            {showForm ? h.writeCancel : h.writeBtn}
                        </button>
                    </div>

                    {/* 탭 */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {tabs.map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => handleTabChange(key)}
                                className={`rounded-full px-4 py-2 text-sm font-extrabold transition-all duration-700 ease-in-out hover:-translate-y-[2px] active:scale-[0.97] ${
                                    activeTab === key
                                        ? tabColors[key]
                                        : isDark
                                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {label}
                                <span className={`ml-1.5 text-xs ${activeTab === key ? "opacity-80" : isDark ? "text-slate-500" : "text-slate-400"}`}>
                                    {key === "all" ? allItems.length
                                        : allItems.filter((i) => i.type === key).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* 작성 폼 */}
                    {showForm && (
                        <div className="animate-slide-down">
                            <WriteForm
                                isDark={isDark}
                                h={h}
                                defaultType={formDefaultType}
                                onClose={() => setShowForm(false)}
                            />
                        </div>
                    )}
                </div>

                {/* 후기 섹션 */}
                {(activeTab === "all" || activeTab === "review") && reviewItems.length > 0 && (
                    <section key={`review-${animKey}`} className={`animate-fade-up ${sectionBase}`} style={{ animationDelay: "60ms" }}>
                        <div className="border-b p-5 sm:px-7 sm:py-5" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgb(226,232,240)" }}>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-base">⭐</span>
                                <h2 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>{h.boardTitle.review}</h2>
                                <span className={`ml-1 text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{reviewItems.length}</span>
                            </div>
                        </div>
                        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                            {reviewItems.map((item, i) => (
                                <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${80 + i * 55}ms` }}>
                                    <ReviewCard
                                        item={item}
                                        isDark={isDark}
                                        h={h}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 동행 섹션 */}
                {(activeTab === "all" || activeTab === "mate") && mateItems.length > 0 && (
                    <section key={`mate-${animKey}`} className={`animate-fade-up ${sectionBase}`} style={{ animationDelay: "120ms" }}>
                        <div className="border-b p-5 sm:px-7 sm:py-5" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgb(226,232,240)" }}>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-base">🤝</span>
                                <h2 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>{h.boardTitle.mate}</h2>
                                <span className={`ml-1 text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{mateItems.length}</span>
                            </div>
                        </div>
                        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                            {mateItems.map((item, i) => (
                                <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${80 + i * 55}ms` }}>
                                    <MateCard
                                        item={item}
                                        isDark={isDark}
                                        h={h}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Q&A 섹션 */}
                {(activeTab === "all" || activeTab === "qna") && qnaItems.length > 0 && (
                    <section key={`qna-${animKey}`} className={`animate-fade-up ${sectionBase}`} style={{ animationDelay: "180ms" }}>
                        <div className="border-b p-5 sm:px-7 sm:py-5" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgb(226,232,240)" }}>
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-base">❓</span>
                                <h2 className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>{h.boardTitle.qna}</h2>
                                <span className={`ml-1 text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{qnaItems.length}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 p-5 sm:p-6">
                            {qnaItems.map((item, i) => (
                                <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${80 + i * 45}ms` }}>
                                    <QnaCard
                                        item={item}
                                        isDark={isDark}
                                        h={h}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {filteredItems.length === 0 && (
                    <div key={`empty-${animKey}`} className={`animate-fade-up ${sectionBase} p-12 text-center`} style={{ animationDelay: "60ms" }}>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{h.noItems}</p>
                    </div>
                )}

                {/* FAQ 링크 */}
                <div className={`animate-fade-up ${sectionBase} p-5 sm:p-6`} style={{ animationDelay: "240ms" }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-lg">💬</span>
                            <div>
                                <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                                    {lang === "ko" ? "자주 묻는 질문" : lang === "ja" ? "よくある質問" : "FAQ"}
                                </p>
                                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    {lang === "ko" ? "공식 답변을 한눈에 확인하세요." : lang === "ja" ? "公式回答を確認できます。" : "Find official answers quickly."}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/faq"
                            className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 ${
                                isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}
                        >
                            {lang === "ko" ? "FAQ 보기 →" : lang === "ja" ? "FAQ一覧 →" : "View FAQ →"}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 상세 모달 */}
            {selectedItem && (
                <DetailModal
                    item={selectedItem}
                    isDark={isDark}
                    h={h}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    );
}

export default function CommunityPage() {
    return (
        <PageShell activeKey="community">
            <CommunityContent />
        </PageShell>
    );
}
