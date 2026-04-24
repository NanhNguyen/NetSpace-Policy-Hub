"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/db/client";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const authError = searchParams.get("error");

    useEffect(() => {
        if (authError === "unauthorized") {
            setError("Tài khoản Lark của bạn không có quyền truy cập vào khu vực quản trị.");
        }
    }, [authError]);

    const handleLarkLogin = (appType: 'internal' | 'external') => {
        const state = encodeURIComponent(JSON.stringify({ 
            appType,
            redirect: '/manage-internal/dashboard',
            origin: window.location.origin 
        }));
        
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
        window.location.href = `${baseUrl}/auth/lark/login?appType=${appType}&redirect=/manage-internal/dashboard&state=${state}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-soft">
                <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary/10 animate-pulse"></div>
                    <div className="relative z-10">
                        <div className="inline-flex p-4 bg-primary rounded-2xl mb-6 text-white shadow-xl shadow-primary/30">
                            <ShieldCheck size={40} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">NetSpace Portal</h1>
                        <p className="text-slate-400 text-sm mt-2 font-medium">Hệ thống quản trị tập trung</p>
                    </div>
                </div>

                <div className="p-10 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleLarkLogin('internal')}
                            className="w-full h-16 bg-white border-2 border-slate-200 hover:border-primary hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <img src="/lark_logo.png" alt="Lark Logo" className="w-7 h-7 object-contain" />
                            Đăng nhập Lark (Internal)
                        </button>

                        <button
                            type="button"
                            onClick={() => handleLarkLogin('external')}
                            className="w-full h-16 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <img src="/lark_logo.png" alt="Lark Logo" className="w-7 h-7 object-contain" />
                            Đăng nhập Lark (External/Intern)
                        </button>
                        
                        <p className="text-[10px] text-center text-text-muted font-bold uppercase tracking-widest px-4 mt-2">
                            Yêu cầu tài khoản đã được cấp quyền Admin
                        </p>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-50">
                        <button 
                            onClick={() => router.push('/')}
                            className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Quay về Trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
