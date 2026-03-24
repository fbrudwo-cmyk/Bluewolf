"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const banners = [
    {
        image: "/images/discount-banner-1.png",
        alt: "기간한정 할인 배너 1",
    },
    {
        image: "/images/discount-banner-2.png",
        alt: "기간한정 할인 배너 2",
    },
    {
        image: "/images/discount-banner-3.png",
        alt: "기간한정 할인 배너 3",
    },
];

export function PromoBannerSection({
    isDark,
}: {
    isDark: boolean;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 3500);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <section
            className={`overflow-hidden rounded-[24px] border shadow-sm transition-colors duration-300 sm:rounded-[28px] ${
                isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"
            }`}
        >
            <div className="relative min-h-[180px] sm:min-h-[240px] lg:min-h-[280px]">
                {banners.map((banner, index) => (
                    <div
                        key={banner.image}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                            index === currentIndex ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                    >
                        <Image
                            src={banner.image}
                            alt={banner.alt}
                            fill
                            priority={index === 0}
                            className="object-cover"
                            sizes="100vw"
                        />
                    </div>
                ))}

                <div
                    className={`absolute inset-0 ${
                        isDark
                            ? "bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.08)_45%,rgba(2,6,23,0.18)_100%)]"
                            : "bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.04)_45%,rgba(15,23,42,0.12)_100%)]"
                    }`}
                />

                <div className="relative z-10 flex min-h-[180px] flex-col justify-between p-4 sm:min-h-[240px] sm:p-6 lg:min-h-[280px] lg:p-8">
                    <div className="flex justify-start">
                        <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] sm:text-sm">
                            기간한정
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`배너 ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all ${
                                    index === currentIndex
                                        ? "w-8 bg-blue-600"
                                        : isDark
                                          ? "w-2.5 bg-white/35 hover:bg-white/60"
                                          : "w-2.5 bg-white/70 hover:bg-white"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}