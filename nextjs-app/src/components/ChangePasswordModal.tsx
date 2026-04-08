"use client";

import { useState } from 'react';
import { supabase } from '@/lib/db/client';
import toast from 'react-hot-toast';
import { X, Lock, RefreshCw, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Mật khẩu phải dài ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            // Re-authenticate first to verify old password (Supabase requirement for user-led password change)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) throw new Error("Không tìm thấy thông tin người dùng");

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: oldPassword
            });

            if (signInError) {
                throw new Error("Mật khẩu cũ không chính xác");
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                throw updateError;
            }

            toast.success("Đổi mật khẩu thành công!");
            setOldPassword('');
            setPassword('');
            setConfirmPassword('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Đổi Mật Khẩu</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bảo mật tài khoản của bạn</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center transition-all active:scale-90 cursor-pointer group"
                        aria-label="Đóng"
                    >
                        <div className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all text-slate-400 group-hover:text-slate-900">
                            <X size={24} />
                        </div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all text-xs uppercase tracking-widest"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <RefreshCw className="animate-spin" size={18} />
                            ) : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
