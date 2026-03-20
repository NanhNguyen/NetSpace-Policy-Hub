"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/db/client";
import { UserService } from "@/lib/services/user.service";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await UserService.login(email, password);
            toast.success("Đăng nhập thành công!");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    }

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

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email của bạn</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ten.ho@netspace.com.vn"
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                        />
                    </div>

                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">error</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-70 mt-4 active:scale-95"
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
                    </button>
                </form>

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
