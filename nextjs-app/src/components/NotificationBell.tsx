"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/db/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Notification {
    id: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell({ role }: { role: 'ADMIN' | 'HR' | 'USER' }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async (userIdParam?: string) => {
        try {
            let userId = userIdParam;
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                userId = user.id;
            }

            const res = await fetch(`${API_URL}/notifications/${userId}/${role}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [role]);

    const handleRead = async (id: string, link?: string) => {
        try {
            // If it's already read, just navigate
            const notif = notifications.find(n => n.id === id);
            if (notif?.is_read) {
                if (link) {
                    router.push(link);
                    setOpen(false);
                }
                return;
            }

            await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            if (link) {
                router.push(link);
                setOpen(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReadAll = async (userIdParam?: string) => {
        try {
            let userId = userIdParam;
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                userId = user.id;
            }
            
            // 1. Aggressive local update
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            
            // 2. Background server update
            fetch(`${API_URL}/notifications/read-all/${userId}/${role}`, { method: 'PATCH' }).catch(console.error);
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={async () => {
                    const becomingOpen = !open;
                    setOpen(becomingOpen);
                    
                    if (becomingOpen) {
                        try {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                                // 1. Fetch latest first
                                await fetchNotifications(user.id);
                                // 2. Mark everything currently in the list as read
                                handleReadAll(user.id);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }}
                className="relative w-10 h-10 rounded-full hover:bg-neutral-soft flex items-center justify-center transition-colors group"
            >
                <span className="material-symbols-outlined text-text-muted text-[22px] group-hover:text-primary">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center px-1 shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl border border-neutral-soft py-2 flex flex-col z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-neutral-soft mb-2 flex justify-between items-center bg-white sticky top-0 z-10">
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Thông báo</p>
                        {loading && <span className="material-symbols-outlined animate-spin text-sm text-slate-400">sync</span>}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400">Không có thông báo nào</div>
                    ) : (
                        notifications.map(n => (
                            <div 
                                key={n.id} 
                                onClick={() => handleRead(n.id, n.link)}
                                className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${n.is_read ? 'opacity-60 bg-white hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50'}`}
                            >
                                <p className={`text-sm ${n.is_read ? 'font-medium text-slate-700' : 'font-bold text-primary'}`}>{n.title}</p>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
