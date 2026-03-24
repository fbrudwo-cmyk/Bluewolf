import { AboutPageTemplate, type AboutCopy } from "@/components/about/AboutPageTemplate";

const aboutCopy = {
    brand: "BlueWolf",
    login: "Log in",
    badge: "About",
    title: "BlueWolf is a team making Mongolia travel more trusted and more convenient.",
    desc: "We aim to connect tour discovery, booking, payment, local operations, reviews, and community in one platform.",
    missionTitle: "What we do",
    missionDesc:
        "By combining local Mongolia travel operations with a smooth digital booking experience, we help travelers understand trips faster and book more easily.",
    valuesTitle: "Core values",
    values: [
        {
            title: "Trust",
            desc: "We reduce the gap between pre-trip information and the real local experience.",
        },
        {
            title: "Simplicity",
            desc: "We simplify complex booking flows into an intuitive customer journey.",
        },
        {
            title: "Local expertise",
            desc: "We reflect real Mongolia operations across itineraries, transport, stays, and activities.",
        },
    ],
    processTitle: "How we operate",
    process: [
        "Tour planning and local route validation",
        "Booking intake and customer consultation",
        "Payment and pre-departure guidance",
        "On-site operations and traveler support",
        "Continuous improvement through reviews and community feedback",
    ],
    ctaTitle: "Start your Mongolia trip with BlueWolf",
    ctaDesc: "Compare tours and start a booking inquiry right away with your preferred schedule.",
    ctaPrimary: "View tours",
    ctaSecondary: "Back to home",
    footerDesc: "Mongolia travel platform · Korean / Japanese / English supported",
    footerCopyright: "© 2026 BlueWolf. All rights reserved.",
} satisfies AboutCopy;

export default function AboutEnPage() {
    return <AboutPageTemplate t={aboutCopy} locale="en" />;
}