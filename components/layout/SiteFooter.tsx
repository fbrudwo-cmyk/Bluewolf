type SiteFooterProps = {
    brand: string;
    description: string;
    copyright?: string;
    isDark: boolean;
};

export function SiteFooter({
    brand,
    description,
    copyright = "© 2026 BlueWolf. All rights reserved.",
    isDark,
}: SiteFooterProps) {
    return (
        <footer
            className={`border-t transition-colors duration-300 ${
                isDark ? "border-white/10 bg-slate-950" : "border-slate-200 bg-white"
            }`}
        >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="text-2xl font-black tracking-tight text-blue-600">{brand}</div>
                    <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                        {description}
                    </p>
                </div>

                <div className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {copyright}
                </div>
            </div>
        </footer>
    );
}