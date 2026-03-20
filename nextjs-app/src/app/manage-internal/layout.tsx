"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    HelpCircle,
    BarChart2,
    Settings,
    LogOut,
    Home,
    Users
} from 'lucide-react';
import Logo from '@/components/Logo';
import { UserService } from '@/lib/services/user.service';
import { UserRoleType } from '@/types';
import NotificationBell from '@/components/NotificationBell';

const navItems = [
    { name: 'Dashboard', href: '/manage-internal/dashboard', icon: LayoutDashboard },
    { name: 'Duyệt yêu cầu', href: '/manage-internal/tickets', icon: MessageSquare },
    { name: 'Chính sách', href: '/manage-internal/policies', icon: FileText },
    { name: 'FAQs', href: '/manage-internal/faqs', icon: HelpCircle },
    { name: 'Thống kê', href: '/manage-internal/analytics', icon: BarChart2 },
    { name: 'Quản lý User', href: '/manage-internal/users', icon: Users },
];

import { supabase } from '@/lib/db/client';
import toast from 'react-hot-toast';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [role, setRole] = useState<'ADMIN' | 'HR' | 'TICKET_MANAGER' | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (pathname === '/manage-internal/login') {
                setIsAuthenticated(true);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/manage-internal/login');
                return;
            }

            const profile = await UserService.getProfile(user.id);
            if (!profile || !profile.role || profile.role.code === 'USER') {
                // Not an admin/hr/manager role
                await supabase.auth.signOut();
                router.push('/manage-internal/login?error=unauthorized');
                return;
            }

            setIsAuthenticated(true);
            setRole(profile.role.code as any);
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Đăng xuất thành công!");
        setIsAuthenticated(false);
        router.push('/manage-internal/login');
    };

    const filteredNavItems = navItems.filter(item => {
        if (!role) return false;
        if (role === 'TICKET_MANAGER') {
            return item.name === 'Duyệt yêu cầu';
        }
        if (role === 'HR') {
            return ['Duyệt yêu cầu', 'Chính sách', 'FAQs', 'Quản lý User'].includes(item.name);
        }
        if (role === 'ADMIN') {
            return true;
        }
        return false;
    });

    if (isAuthenticated === null) {
        return <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
    }

    if (pathname === '/manage-internal/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-text-main">
            {/* Sidebar */}
            <aside className="w-68 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 shadow-2xl z-20 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                    <Link href="/" className="flex items-center gap-3">
                        <Logo className="w-10 h-10 shadow-lg shadow-indigo-500/10" hideText={true} />
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg tracking-tight leading-none text-white">NetSpace</span>
                            <span className="text-[10px] font-black text-brand-blue uppercase mt-1 tracking-[0.2em]">{role} PORTAL</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 mt-4">
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold text-slate-400 group"
                    >
                        <Home className="w-5 h-5 group-hover:text-white transition-colors" />
                        Về trang chủ
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors text-sm font-semibold text-left group"
                    >
                        <LogOut className="w-5 h-5 group-hover:animate-pulse" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-68 p-8 min-h-screen bg-slate-50/50 backdrop-blur-sm relative">
                <div className="absolute top-6 right-8 z-50">
                    {(role === 'HR' || role === 'ADMIN') && <NotificationBell role="HR" />}
                </div>
                <div className="max-w-7xl mx-auto pt-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

