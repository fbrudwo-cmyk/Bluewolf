import "./globals.css";
import localFont from "next/font/local";
import { ScrollRestorer } from "@/components/layout/ScrollRestorer";

const notoSansCJK = localFont({
    src: [
        { path: "../public/fonts/NotoSansCJKkr-Regular.otf", weight: "400", style: "normal" },
        { path: "../public/fonts/NotoSansCJKkr-Medium.otf", weight: "500", style: "normal" },
        { path: "../public/fonts/NotoSansCJKkr-Bold.otf", weight: "700", style: "normal" },
        { path: "../public/fonts/NotoSansCJKkr-Black.otf", weight: "900", style: "normal" },
    ],
    variable: "--font-noto-sans-cjk",
    display: "swap",
});

export const metadata = {
    title: "BlueWolf",
    description: "몽골 여행 플랫폼",
};

const themeInitScript = `
(function () {
    try {
        var storageKey = "bluewolf-theme";
        var savedTheme = localStorage.getItem(storageKey);
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
        document.documentElement.classList.toggle("dark", shouldUseDark);
    } catch (error) {}
})();
`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={notoSansCJK.variable}>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                <ScrollRestorer />
                {children}
            </body>
        </html>
    );
}