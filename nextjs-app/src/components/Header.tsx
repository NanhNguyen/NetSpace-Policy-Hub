"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import HRModal from "./HRModal";
import { supabase } from "@/lib/db/client";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import ChangePasswordModal from "./ChangePasswordModal";

const NAV_LINKS = [
    { href: "/categories", label: "Danh mục" },
    { href: "/faq", label: "FAQ" },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [pwdModalOpen, setPwdModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        
        const fetchProfile = async (sessionUser: any) => {
            try {
                const { UserService } = await import("@/lib/services/user.service");
                const profile = await UserService.getProfile(sessionUser.id);
                if (!isMounted) return;
                
                // Merge database profile with session metadata
                // Prioritize the name from Lark if the database profile doesn't have a valid full_name
                setUser({
                    ...sessionUser,
                    user_metadata: { 
                        ...sessionUser.user_metadata,
                        full_name: profile?.full_name || sessionUser.user_metadata?.full_name, 
                        role: profile?.role?.code 
                    }
                });
            } catch (e) {
                if (isMounted) setUser(sessionUser);
            } finally {
                if (isMounted) setIsLoadingUser(false);
            }
        };

        // Check active session immediately to avoid double fetching
        const initUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                await fetchProfile(data.session.user);
            } else {
                if (isMounted) {
                    setUser(null);
                    setIsLoadingUser(false);
                }
            }
        };

        initUser();

        // Listen for Auth changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                if (session?.user) {
                    fetchProfile(session.user);
                }
            } else if (event === 'SIGNED_OUT') {
                if (isMounted) {
                    setUser(null);
                    setIsLoadingUser(false);
                }
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
            isMounted = false;
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

    // Show Ask HR for everyone so standard UI components don't randomly disappear
    const showAskHR = true;

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-soft shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
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
                            {user && <NotificationBell role="USER" />}
                        </div>

                        {/* Authentication Status UI */}
                        {isLoadingUser ? (
                            <div className="w-10 h-10 bg-slate-100 animate-pulse rounded-full" />
                        ) : !user ? (
                            <Link href="/auth/login" className="hidden sm:flex items-center justify-center bg-slate-100 hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 transition-all border border-slate-200">
                                Đăng nhập
                            </Link>
                        ) : (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-primary transition-all overflow-hidden group"
                                >
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:bg-primary/20">
                                        {user.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            (user.user_metadata?.full_name || user.email).substring(0, 2)
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {menuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-soft py-2 flex flex-col z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
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
                                            onClick={() => { setMenuOpen(false); setPwdModalOpen(true); }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-main hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px] text-text-muted">key</span>
                                            Đổi mật khẩu
                                        </button>
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
                        )}

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
                        {/* Mobile Login / User Options */}
                        {!user ? (
                            <Link
                                href="/auth/login"
                                onClick={() => setMobileOpen(false)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-800 text-sm font-bold mt-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">login</span>
                                Đăng nhập ngay
                            </Link>
                        ) : null}
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
            <ChangePasswordModal open={pwdModalOpen} onClose={() => setPwdModalOpen(false)} />

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
