"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Logo from "./Logo";
import HRModal from "./HRModal";

const NAV_LINKS = [
    { href: "/categories", label: "Danh mục Chính sách" },
    { href: "/updates", label: "Cập nhật" },
    { href: "/faq", label: "FAQ" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Secret access logic
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);

    const handleLogoClick = (e: React.MouseEvent) => {
        // Only trigger secret on the homepage to avoid accidental navigation while reading
        const now = Date.now();
        if (now - lastClickTime.current < 800) {
            clickCount.current += 1;
        } else {
            clickCount.current = 1;
        }
        lastClickTime.current = now;

        if (clickCount.current === 5) {
            clickCount.current = 0;
            router.push("/manage-internal/login");
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-soft shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 py-4">
                    {/* Logo with Secret Access */}
                    <div className="flex items-center gap-3.5 flex-shrink-0">
                        {/* Icon with Secret Access (Click 5x) */}
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <div
                                onClick={handleLogoClick}
                                className="cursor-pointer active:scale-95 transition-all select-none pr-4 border-r border-slate-100"
                                title="NetSpace Logo"
                            >
                                <Logo className="w-40 h-10" />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Điều hướng chính">
                        {NAV_LINKS.map((link) => {
                            const active = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-semibold transition-colors pb-0.5 ${active
                                        ? "text-primary border-b-2 border-primary"
                                        : "hover:text-primary"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                            Hỏi HR
                        </button>
                        <div className="flex items-center gap-2 mr-2">
                            <button className="relative w-10 h-10 rounded-full hover:bg-neutral-soft flex items-center justify-center transition-colors group">
                                <span className="material-symbols-outlined text-text-muted text-[22px] group-hover:text-primary">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                        <Link href="/auth/login" className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-primary transition-all">
                            <span className="material-symbols-outlined text-text-muted text-[22px]">account_circle</span>
                        </Link>
                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-soft transition-colors"
                            aria-label="Mở menu"
                        >
                            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-t border-neutral-soft px-4 pb-4 pt-2 space-y-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${pathname.startsWith(link.href)
                                    ? "bg-neutral-soft text-primary font-bold"
                                    : "hover:bg-neutral-soft"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => { setMobileOpen(false); setModalOpen(true); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-text-main text-sm font-bold transition-colors mt-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                            Hỏi HR
                        </button>
                    </div>
                )}
            </header>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
