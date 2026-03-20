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

    const fetchNotifications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const res = await fetch(`${API_URL}/notifications/${user.id}/${role}`);
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

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => { setOpen(!open); fetchNotifications(); }}
                className="relative w-10 h-10 rounded-full hover:bg-neutral-soft flex items-center justify-center transition-colors group"
            >
                <span className="material-symbols-outlined text-text-muted text-[22px] group-hover:text-primary">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
