"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import HRModal from "./HRModal";
import { supabase } from "@/lib/db/client";

const NAV_LINKS = [
    { href: "/categories", label: "Chính Sách" },
    { href: "/faq", label: "FAQ" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Close menu on outside click
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
        router.push("/");
    };

    const handleAskHR = () => {
        if (!user) {
            router.push("/auth/login?redirect=ask-hr");
            return;
        }
        setModalOpen(true);
    };

    // Secret access logic
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);

    const handleLogoClick = (e: React.MouseEvent) => {
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
                            onClick={handleAskHR}
                            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/20 active:scale-95"
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

                        {/* User Menu Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => user ? setMenuOpen(!menuOpen) : router.push("/auth/login")}
                                className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-primary transition-all overflow-hidden group"
                            >
                                {user?.email ? (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:bg-primary/20">
                                        {user.email.substring(0, 2)}
                                    </div>
                                ) : (
                                    <span className="material-symbols-outlined text-text-muted text-[22px] group-hover:text-primary">account_circle</span>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && user && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-soft py-2 flex flex-col z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-neutral-soft mb-2">
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Tài khoản</p>
                                        <p className="text-sm font-black text-text-main truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/tickets"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-main hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-text-muted">history</span>
                                        Yêu cầu của tôi
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-neutral-soft mt-2"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>

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
                            onClick={() => { setMobileOpen(false); handleAskHR(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors mt-2"
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
