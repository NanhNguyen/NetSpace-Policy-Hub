"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/db/client";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLarkLogin = (appType: 'internal' | 'external') => {
        const state = encodeURIComponent(JSON.stringify({ 
            appType,
            redirect: '/',
            origin: window.location.origin 
        }));
        
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
        window.location.href = `${baseUrl}/auth/lark/login?appType=${appType}&state=${state}`;
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/10">
                        <span className="material-symbols-outlined text-[32px] text-primary">person</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Đăng nhập Cá nhân hóa</h1>
                    <p className="text-sm text-slate-500 mt-2">Đăng nhập để xem lịch sử câu hỏi và phản hồi từ HR.</p>
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-[16px]">error</span> {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleLarkLogin('internal')}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-[#1F5BEC] hover:bg-blue-50/50 text-slate-700 font-bold py-4 rounded-xl transition-all active:scale-95 group shadow-sm"
                        >
                            <img src="/lark_logo.png" alt="Lark Logo" className="w-6 h-6 object-contain" />
                            Đăng nhập Nhân viên Chính thức
                        </button>

                        <button
                            type="button"
                            onClick={() => handleLarkLogin('external')}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                        >
                            <img src="/lark_logo.png" alt="Lark Logo" className="w-6 h-6 object-contain" />
                            Đăng nhập Thực tập sinh (Lark)
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 mb-4">Hoặc tiếp tục mà không cần đăng nhập</p>
                    <Link
                        href="/"
                        className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
