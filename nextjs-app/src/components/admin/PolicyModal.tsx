"use client";

import { useEffect, useState, useRef } from 'react';
import { X, Save, AlertCircle, FileText, Upload, Trash2, Eye } from 'lucide-react';
import { Policy } from '@/types';
import { CATEGORIES } from '@/lib/data';
import dynamic from 'next/dynamic';
import { StorageService } from '@/lib/services/storage.service';

// Lazy-load to avoid SSR issues with contentEditable
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface PolicyModalProps {
    policy?: Policy | null;
    onClose: () => void;
    onSave: (policyData: any) => Promise<void>;
}

export default function PolicyModal({ policy, onClose, onSave }: PolicyModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'hr' as any,
        icon: 'description',
        excerpt: '',
        content: '',
        published: true,
        pdf_url: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'd')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-') 
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    useEffect(() => {
        if (policy) {
            setFormData({
                title: policy.title || '',
                slug: policy.slug || '',
                category: policy.category || 'hr',
                icon: policy.icon || 'description',
                excerpt: policy.excerpt || '',
                content: policy.content || '',
                published: policy.published ?? true,
                pdf_url: policy.pdf_url || '',
            });

            // Scroll to top when policy data is loaded
            if (formRef.current) {
                formRef.current.scrollTop = 0;
            }
        }
    }, [policy]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
          setError('Chỉ chấp nhận tệp PDF.');
          return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          setError('Tệp quá lớn. Vui lòng chọn tệp dưới 10MB.');
          return;
        }

        setUploading(true);
        setError(null);
        try {
          const url = await StorageService.uploadPolicyPdf(file, formData.slug || 'policy');
          setFormData(prev => ({ ...prev, pdf_url: url }));
        } catch (err: any) {
          setError('Tải tệp lên thất bại: ' + err.message);
        } finally {
          setUploading(false);
        }
    };

    const removePdf = async () => {
        if (!formData.pdf_url) return;
        setUploading(true);
        try {
          await StorageService.deleteFile(formData.pdf_url);
          setFormData(prev => ({ ...prev, pdf_url: '' }));
        } catch (err: any) {
          setError('Xóa tệp thất bại.');
        } finally {
          setUploading(false);
        }
    };

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
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:max-w-5xl max-h-[90vh] rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out fill-mode-forwards"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex flex-col items-center justify-center bg-white flex-shrink-0 relative">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {policy ? 'Chỉnh sửa Chính sách' : 'Thêm Chính sách Mới'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1 font-medium italic">Soạn thảo nội dung quy định chi tiết cho nhân viên</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable form */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar"
                >
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Tiêu đề <span className="text-primary">*</span>
                            </label>
                            <input
                                required
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-neutral-soft rounded-2xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-300"
                                placeholder="VD: Quy định Làm việc Từ xa"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Danh mục <span className="text-primary">*</span>
                            </label>
                            <div className="flex flex-col gap-3">
                                <select
                                    required
                                    value={Object.keys(CATEGORIES).includes(formData.category) ? formData.category : 'other'}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'other') {
                                            setFormData({ ...formData, category: '' });
                                        } else {
                                            setFormData({ ...formData, category: val, icon: CATEGORIES[val as keyof typeof CATEGORIES]?.icon || formData.icon });
                                        }
                                    }}
                                    className="w-full px-5 py-4 bg-slate-50 border border-neutral-soft rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-700"
                                >
                                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                                        <option key={key} value={key}>{cat.label}</option>
                                    ))}
                                    <option value="other">Thêm danh mục khác...</option>
                                </select>
                                
                                {(!Object.keys(CATEGORIES).includes(formData.category) || formData.category === '') && (
                                    <input
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-4 bg-primary/5 border border-primary/20 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-primary/30"
                                        placeholder="Nhập tên danh mục mới..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Slug (URL tự động)
                            </label>
                            <input
                                readOnly
                                value={formData.slug}
                                className="w-full px-5 py-4 bg-slate-100/50 border border-neutral-soft rounded-2xl text-sm font-mono text-slate-400 font-bold focus:outline-none transition-all cursor-not-allowed text-center"
                                placeholder="tu-dong-theo-tieu-de"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                Tài liệu bản gốc (PDF)
                            </label>
                            <div className="relative">
                              {formData.pdf_url ? (
                                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in zoom-in-95">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                      <FileText size={20} />
                                    </div>
                                    <div className="truncate">
                                      <p className="text-xs font-black text-slate-900 truncate">Bản gốc đã được tải lên</p>
                                      <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                                        <Eye size={12} /> Xem tệp
                                      </a>
                                    </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={removePdf}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${uploading ? 'opacity-50 pointer-events-none' : 'border-slate-200'}`}
                                >
                                  {uploading ? (
                                    <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                                  ) : (
                                    <>
                                      <Upload size={20} className="text-slate-400 mb-1" />
                                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Tải lên file PDF</p>
                                    </>
                                  )}
                                  <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                  />
                                </div>
                              )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl w-fit">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Trạng thái:</label>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.published
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'bg-slate-200 text-slate-500'
                                }`}
                        >
                            {formData.published ? '✓ Đã phát hành' : '○ Bản nháp'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                            Mô tả tóm tắt
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full px-5 py-4 bg-slate-50 border border-neutral-soft rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none placeholder:text-slate-300"
                            placeholder="Tóm tắt ngắn gọn hiển thị ở danh sách ngoài..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                            Nội dung chi tiết <span className="text-primary">*</span>
                        </label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            placeholder="Sử dụng bộ công cụ phía trên để trình bày nội dung chuyên nghiệp..."
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-10 py-8 border-t border-gray-100 flex justify-center gap-4 bg-white flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-12 py-4 border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all text-sm active:scale-95"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        onClick={handleSubmit as any}
                        className="px-16 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-3 disabled:opacity-50 text-sm active:scale-95"
                    >
                        {submitting ? (
                            <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                        ) : (
                            <>
                                <Save className="w-5 h-5 text-primary" />
                                Lưu và Cập nhật
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
