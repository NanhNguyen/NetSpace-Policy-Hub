"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import HRModal from "./HRModal";
import { supabase } from "@/lib/db/client";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
    { href: "/categories", label: "Chính Sách" },
    { href: "/faq", label: "FAQ" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProfile = async (id: string, email: string) => {
            try {
                const { UserService } = await import("@/lib/services/user.service");
                const profile = await UserService.getProfile(id);
                if (profile) {
                    setUser({
                        id: profile.id,
                        email: profile.email,
                        user_metadata: { full_name: profile.full_name, role: profile.role?.code }
                    });
                } else {
                    setUser({ id, email });
                }
            } catch (e) {
                setUser({ id, email });
            }
        };

        // Initial check
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                fetchProfile(data.user.id, data.user.email || "");
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email || "");
            } else {
                setUser(null);
            }
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
        localStorage.removeItem('mock_jwt_token');
        localStorage.removeItem('mock_user_id');
        setMenuOpen(false);
        setUser(null);
        toast.success("Đăng xuất thành công. Hẹn gặp lại!");
        router.push("/");
    };

    const handleAskHR = () => {
        if (!user) {
            setLoginPromptOpen(true);
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

    const isAdmin = user?.email === 'admin@gmail.com' || user?.user_metadata?.role === 'ADMIN';
    const showAskHR = !isAdmin;

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
                        {showAskHR && (
                            <button
                                onClick={handleAskHR}
                                className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/20 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                Hỏi HR
                            </button>
                        )}
                        <div className="flex items-center gap-2 mr-2">
                            {user && <NotificationBell role="USER" />}
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
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
                            {menuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-soft py-2 flex flex-col z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-neutral-soft mb-2">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Xin chào,</p>
                                                <p className="text-sm font-black text-text-main truncate">{user.user_metadata?.full_name || user.email}</p>
                                                <p className="text-[10px] text-text-muted truncate mt-0.5">{user.email}</p>
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
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-3 border-b border-neutral-soft mb-2">
                                                <p className="text-xs font-bold text-text-main">Bạn chưa đăng nhập</p>
                                                <p className="text-[10px] text-text-muted mt-0.5">Đăng nhập để xem thông tin</p>
                                            </div>
                                            <Link
                                                href="/auth/login"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">login</span>
                                                Đăng nhập ngay
                                            </Link>
                                        </>
                                    )}
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
                        {showAskHR && (
                            <button
                                onClick={() => { setMobileOpen(false); handleAskHR(); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors mt-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                Hỏi HR
                            </button>
                        )}
                    </div>
                )}
            </header>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />

            {/* Login Prompt Modal */}
            {loginPromptOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setLoginPromptOpen(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl scale-in-center animate-in zoom-in-95 duration-200 relative" onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button 
                            onClick={() => setLoginPromptOpen(false)}
                            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600 active:scale-90"
                            aria-label="Đóng"
                        >
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </button>

                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                        </div>
                        <h3 className="text-xl font-black text-text-main text-center mb-2">Yêu cầu đăng nhập</h3>
                        <p className="text-sm text-text-muted text-center mb-8 leading-relaxed">
                            Để sử dụng tính năng <span className="font-bold text-text-main">Hỏi HR</span>, bạn vui lòng đăng nhập vào hệ thống nhé!
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setLoginPromptOpen(false);
                                    router.push("/auth/login?redirect=ask-hr");
                                }}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                            >
                                Đăng nhập ngay
                            </button>
                            <button
                                onClick={() => setLoginPromptOpen(false)}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-text-muted font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
                            >
                                Để sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
