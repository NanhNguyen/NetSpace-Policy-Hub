"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // For demonstration, using a simple password. 
        // In a real app, this would be a full identity check.
        if (password === "NetSpace@2026") {
            localStorage.setItem("admin_auth", "true");
            localStorage.setItem("admin_role", "ADMIN");
            router.push("/manage-internal/dashboard");
        } else {
            setError("Mật khẩu không chính xác. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-soft">
                <div className="bg-slate-900 p-8 text-white text-center">
                    <div className="inline-flex p-3 bg-primary rounded-xl mb-4 text-text-main shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">HR Portal Login</h1>
                    <p className="text-slate-400 text-sm mt-1">Truy cập hệ thống quản trị chính sách</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">
                            Mật khẩu truy cập
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-xs font-medium p-3 rounded-lg border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                        Đăng nhập ngay
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="text-xs text-text-muted hover:text-primary transition-colors"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
