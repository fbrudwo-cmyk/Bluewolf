import { type Locale } from "@/lib/bluewolf-data";

type HeaderCopySource = {
    navTours: string;
    navBooking: string;
    navCommunity: string;
    navFaq: string;
};

export type HeaderNavItem = {
    key: string;
    href: string;
    label: string;
};

const fixedHeaderLabel = {
    ko: {
        home: "홈",
        about: "회사소개",
        contact: "문의",
    },
    ja: {
        home: "ホーム",
        about: "会社紹介",
        contact: "お問い合わせ",
    },
    en: {
        home: "Home",
        about: "About",
        contact: "Contact",
    },
} as const;

function getAboutHref(locale: Locale) {
    if (locale === "ko") return "/about";
    return `/about/${locale}`;
}

export function buildHeaderNav({
    locale,
    pageType,
    t,
}: {
    locale: Locale;
    pageType: "home" | "about";
    t: HeaderCopySource;
}): HeaderNavItem[] {
    const fixed = fixedHeaderLabel[locale];
    const prefix = pageType === "home" ? "" : "/";

    return [
        { key: "home", href: "/", label: fixed.home },
        { key: "about", href: getAboutHref(locale), label: fixed.about },
        { key: "tours", href: `${prefix}#tours`, label: t.navTours },
        { key: "booking", href: `${prefix}#booking`, label: t.navBooking },
        { key: "community", href: `${prefix}#community`, label: t.navCommunity },
        { key: "faq", href: `${prefix}#faq`, label: t.navFaq },
        { key: "contact", href: "/contact", label: fixed.contact },
    ];
}