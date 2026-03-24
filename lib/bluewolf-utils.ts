import { type Locale, type Tour } from "@/lib/bluewolf-data";

export function filterTours(
    items: Tour[],
    lang: Locale,
    keyword: string,
    duration: string,
    region: string,
    theme: string,
    sort: string
) {
    const q = keyword.trim().toLowerCase();

    const list = items.filter((tour) => {
        const matchKeyword =
            !q ||
            tour.title[lang].toLowerCase().includes(q) ||
            tour.desc[lang].toLowerCase().includes(q);

        return (
            matchKeyword &&
            (duration === "all" || tour.durationType === duration) &&
            (region === "all" || tour.region === region) &&
            (theme === "all" || tour.theme === theme)
        );
    });

    if (sort === "priceLow") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") return [...list].sort((a, b) => b.price - a.price);
    return list;
}

export function formatPrice(value: number) {
    return `₩${value.toLocaleString("ko-KR")}`;
}