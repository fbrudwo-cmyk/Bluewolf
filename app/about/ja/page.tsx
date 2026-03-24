import { AboutPageTemplate, type AboutCopy } from "@/components/about/AboutPageTemplate";

const aboutCopy = {
    brand: "BlueWolf",
    login: "ログイン",
    badge: "会社紹介",
    title: "BlueWolfは、モンゴル旅行をもっと信頼できて、もっと簡単にするチームです。",
    desc: "ツアー検索から予約、決済、現地運営、レビュー、コミュニティまでを一つのプラットフォームでつなぐことを目指しています。",
    missionTitle: "私たちの仕事",
    missionDesc:
        "モンゴル現地での運営経験とデジタル予約体験を組み合わせ、お客様がより簡単に旅行を理解し、より素早く予約できるよう設計しています。",
    valuesTitle: "コアバリュー",
    values: [
        {
            title: "信頼",
            desc: "旅行前の情報と実際の現地体験のギャップを減らします。",
        },
        {
            title: "シンプルさ",
            desc: "複雑な予約プロセスを直感的な流れに整理します。",
        },
        {
            title: "現地性",
            desc: "モンゴル現地の日程、移動、宿泊、体験の実運営を反映します。",
        },
    ],
    processTitle: "運営フロー",
    process: [
        "ツアー企画と現地動線の検証",
        "予約受付と相談対応",
        "決済と出発前案内",
        "現地運営と顧客サポート",
        "レビューとコミュニティを基に改善",
    ],
    ctaTitle: "BlueWolfと一緒にモンゴル旅行を始めましょう",
    ctaDesc: "ツアーを比較し、ご希望の日程でそのまま予約相談を始められます。",
    ctaPrimary: "ツアーを見る",
    ctaSecondary: "トップへ戻る",
    footerDesc: "モンゴル専門旅行プラットフォーム · 韓国語 / 日本語 / 英語対応",
    footerCopyright: "© 2026 BlueWolf. All rights reserved.",
} satisfies AboutCopy;

export default function AboutJaPage() {
    return <AboutPageTemplate t={aboutCopy} locale="ja" />;
}