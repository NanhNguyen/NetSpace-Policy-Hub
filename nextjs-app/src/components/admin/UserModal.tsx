"use client";

import { useState } from 'react';
import { X, Save, AlertCircle, UserPlus, Mail, User as UserIcon, RefreshCw } from 'lucide-react';
import { Role } from '@/types';

interface UserModalProps {
    onClose: () => void;
    onSave: (userData: { email: string; full_name: string; role_id: number; password?: string }) => Promise<void>;
    roles: Role[];
    initialData?: {
        id: string;
        email: string;
        full_name: string;
        role_id: number;
    };
}

export default function UserModal({ onClose, onSave, roles, initialData }: UserModalProps) {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        email: initialData?.email || '',
        full_name: initialData?.full_name || '',
        role_id: initialData?.role_id || 4, // Default to USER
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || (isEdit ? 'Lỗi khi cập nhật' : 'Lỗi khi tạo tài khoản'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            {isEdit ? <UserIcon size={20} /> : <UserPlus size={20} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{isEdit ? 'Cập nhật Người dùng' : 'Cấp Tài khoản mới'}</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isEdit ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên vào hệ thống'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                    >
                        <X size={20} />
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email nhân viên</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                placeholder="example@gmail.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu khởi tạo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">lock</span>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                        <div className="relative">
                            <select
                                required
                                value={formData.role_id}
                                onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 pr-12 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold cursor-pointer appearance-none"
                            >
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name} ({role.code})</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
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
                            disabled={submitting}
                            className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <RefreshCw className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <Save size={18} className="text-primary" />
                                    {isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
