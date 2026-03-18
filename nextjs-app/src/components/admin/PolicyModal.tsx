"use client";

import { useEffect, useState } from 'react';
import { X, Save, AlertCircle, Plus } from 'lucide-react';
import { Policy, PolicyCategory } from '@/types';

interface PolicyModalProps {
    policy?: Policy | null;
    onClose: () => void;
    onSave: (policyData: any) => Promise<void>;
}

export default function PolicyModal({ policy, onClose, onSave }: PolicyModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'hr' as PolicyCategory,
        icon: 'description',
        excerpt: '',
        content: '',
        published: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (policy) {
            setFormData({
                title: policy.title,
                slug: policy.slug,
                category: policy.category,
                icon: policy.icon,
                excerpt: policy.excerpt || '',
                content: policy.content,
                published: policy.published
            });
        }
    }, [policy]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lưu chính sách');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-900">
                        {policy ? 'Chỉnh sửa Chính sách' : 'Thêm Chính sách Mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tiêu đề</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="VD: Chính sách Làm việc Từ xa"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Slug (URL)</label>
                            <input
                                required
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="chinh-sach-lam-viec"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Danh mục</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as PolicyCategory })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="hr">Nhân sự</option>
                                <option value="it">IT & Bảo mật</option>
                                <option value="leave">Nghỉ phép</option>
                                <option value="workplace">Nội quy</option>
                                <option value="finance">Tài chính</option>
                                <option value="ops">Vận hành</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả ngắn</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            placeholder="Tóm tắt ngắn gọn chính sách..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nội dung (HTML)</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="<h2>Mục tiêu</h2><p>...</p>"
                        />
                    </div>

                    <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex items-center gap-1.5 mb-2">
                            <Save className="w-3 h-3" /> Tài liệu đính kèm (PDF, DOCX)
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                                onClick={() => alert('Chức năng tải lên file đang được cấu hình...')}
                            >
                                <Plus className="w-3.5 h-3.5 text-primary" /> Chọn file từ máy tính
                            </button>
                            <span className="text-[10px] text-slate-400 font-medium italic">Chưa có file nào được chọn</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={e => setFormData({ ...formData, published: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="published" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                            Công khai chính sách này
                        </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-black font-black rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {submitting ? 'Đang lưu...' : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
