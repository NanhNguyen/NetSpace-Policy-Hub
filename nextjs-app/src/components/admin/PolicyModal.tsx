"use client";

import { useEffect, useRef, useState } from 'react';
import { X, Save, AlertCircle, Plus, ChevronDown } from 'lucide-react';
import { Policy, PolicyCategory } from '@/types';
import { CATEGORIES } from '@/lib/data';
import dynamic from 'next/dynamic';

// Lazy-load to avoid SSR issues with contentEditable
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface PolicyModalProps {
    policy?: Policy | null;
    onClose: () => void;
    onSave: (policyData: any) => Promise<void>;
}

const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([key, val]) => ({
    key: key as PolicyCategory,
    label: val.label,
    icon: val.icon,
}));

export default function PolicyModal({ policy, onClose, onSave }: PolicyModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'hr' as PolicyCategory,
        icon: 'description',
        excerpt: '',
        content: '',
        published: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [catOpen, setCatOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: prev.slug || title.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'd')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
        }));
    };

    useEffect(() => {
        if (policy) {
            setFormData({
                title: policy.title,
                slug: policy.slug,
                category: policy.category,
                icon: policy.icon,
                excerpt: policy.excerpt || '',
                content: policy.content,
                published: policy.published,
            });
        }
    }, [policy]);

    // Close category dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) {
                setCatOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

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

    const selectedCat = CATEGORY_OPTIONS.find((c) => c.key === formData.category);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:max-w-3xl max-h-[96vh] sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">
                            {policy ? 'Chỉnh sửa Chính sách' : 'Thêm Chính sách Mới'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {policy ? `ID: ${policy.id}` : 'Điền thông tin và soạn nội dung bên dưới'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Title + Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Tiêu đề <span className="text-red-400">*</span>
                            </label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
                                placeholder="VD: Quy định Làm việc Từ xa"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Slug (URL)
                            </label>
                            <input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
                                placeholder="quy-dinh-lam-viec-tu-xa"
                            />
                        </div>

                        {/* Custom Category Dropdown */}
                        <div className="space-y-1.5" ref={catRef}>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Danh mục <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setCatOpen((v) => !v)}
                                    className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:bg-gray-100"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            {selectedCat?.icon || 'description'}
                                        </span>
                                        {selectedCat?.label || 'Chọn danh mục'}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {catOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                                        {CATEGORY_OPTIONS.map((cat) => (
                                            <button
                                                type="button"
                                                key={cat.key}
                                                onClick={() => {
                                                    setFormData({ ...formData, category: cat.key });
                                                    setCatOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors text-left ${formData.category === cat.key
                                                        ? 'bg-primary/5 text-primary'
                                                        : 'text-slate-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className={`material-symbols-outlined text-[18px] ${formData.category === cat.key ? 'text-primary' : 'text-slate-400'
                                                    }`}>
                                                    {cat.icon}
                                                </span>
                                                {cat.label}
                                                {formData.category === cat.key && (
                                                    <span className="ml-auto text-primary text-xs font-black">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Mô tả ngắn (hiển thị trên thẻ)
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-gray-300"
                            placeholder="Tóm tắt ngắn gọn, 1–2 câu..."
                        />
                    </div>

                    {/* Rich Text Content Editor */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                            Nội dung chính sách <span className="text-red-400">*</span>
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            placeholder="Bắt đầu soạn thảo nội dung chính sách..."
                        />
                    </div>

                    {/* Publish toggle */}
                    <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer group hover:bg-primary/5 hover:border-primary/20 transition-all">
                        <input
                            type="checkbox"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div>
                            <p className="text-sm font-bold text-gray-700">Công khai chính sách này</p>
                            <p className="text-[10px] text-gray-400">Nhân viên có thể tìm và đọc ngay sau khi lưu.</p>
                        </div>
                    </label>
                </form>

                {/* Footer buttons */}
                <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/60 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form=""
                        disabled={submitting}
                        onClick={handleSubmit as any}
                        className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-95"
                    >
                        {submitting ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Lưu chính sách
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
