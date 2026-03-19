"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { UserService } from "@/lib/services/user.service";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const authError = searchParams.get("error");

    useEffect(() => {
        if (authError === "unauthorized") {
            setError("Bạn không có quyền truy cập vào khu vực quản trị.");
        }
    }, [authError]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await UserService.login(email, password);

            if (res) {
                toast.success(`Xin chào Admin! Chào mừng quay trở lại hệ thống quản trị.`);
                router.push("/manage-internal/dashboard");
            } else {
                throw new Error("Email hoặc mật khẩu không đúng.");
            }
        } catch (err: any) {
            setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setLoading(false);
        }
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

                <form onSubmit={handleLogin} className="p-10 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 ml-1">
                                Email công việc
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hr@gmail.com"
                                    className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 ml-1">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Đăng nhập hệ thống"
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-[10px] text-text-muted font-bold italic">Sử dụng tài khoản HR đã cấp để truy cập</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
