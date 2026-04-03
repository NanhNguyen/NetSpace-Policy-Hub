"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, User, Loader2 } from 'lucide-react';
import { Policy } from '@/types';
import { CATEGORIES } from '@/lib/data';
import { PolicyService } from '@/lib/services/policy.service';

interface PolicyViewModalProps {
    policy: Policy | null;
    onClose: () => void;
}

export default function PolicyViewModal({ policy: initialPolicy, onClose }: PolicyViewModalProps) {
    const [policy, setPolicy] = useState<Policy | null>(initialPolicy);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!initialPolicy?.id) return;
        
        const fetchFullPolicy = async () => {
            setLoading(true);
            try {
                // Determine if we should fetch by ID or slug
                // For local ones, ID and slug are usually the same (e.g., 'remote-work')
                // But preferred is always to fetch from API if available
                const fullData = await PolicyService.getById(initialPolicy.id);
                if (fullData) {
                    setPolicy(fullData);
                }
            } catch (err) {
                console.warn('Failed to fetch full policy, using initial data:', err);
                // We keep the initialPolicy if fetch fails
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if content is suspiciously short or if we want to ensure sync with DB
        // Based on user request, they want it linked to DB, so we fetch always to be sure.
        fetchFullPolicy();
    }, [initialPolicy?.id]);

    if (!policy) return null;

    const catInfo = CATEGORIES[policy.category as keyof typeof CATEGORIES] || { label: policy.category, icon: 'description' };
    const updatedDate = new Date(policy.updated_at).toLocaleDateString('vi-VN');

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-primary to-[#2C5282] px-5 sm:px-8 py-6 sm:py-8 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-20 -mr-24 -mt-24 pointer-events-none" />

                    <div className="relative z-10 pr-10">
                        {/* Category + Status badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                <span className="material-symbols-outlined text-primary text-[12px]">{catInfo.icon}</span>
                                {catInfo.label}
                            </span>
                            <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                ✓ Hiệu lực
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-3xl font-black mb-4 leading-tight tracking-tight">
                            {policy.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 text-xs text-white/60 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-primary flex-shrink-0" />
                                <span>Cập nhật: <strong className="text-white/80">{updatedDate}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User size={13} className="text-primary flex-shrink-0" />
                                <span>Phụ trách: <strong className="text-white/80">Phòng Nhân sự</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Đóng"
                        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10 active:scale-90"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto space-y-10 pb-12">
                        {/* Excerpt Section */}
                        {policy.excerpt && (
                            <div className="mx-5 sm:mx-8 mt-8">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    Tóm tắt quy định
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm font-bold italic shadow-sm border-l-4 border-l-primary/30">
                                    "{policy.excerpt}"
                                </div>
                            </div>
                        )}

                        {/* Policy HTML Content Section */}
                        <div className="px-5 sm:px-8 relative min-h-[300px]">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Nội dung chi tiết văn bản
                            </div>
                            
                            {loading && (
                                <div className="absolute inset-x-0 top-16 bottom-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all rounded-3xl">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang đồng bộ từ Database...</span>
                                    </div>
                                </div>
                            )}
                        
                        <div
                            dangerouslySetInnerHTML={{ __html: policy.content || '<p class="text-slate-400 italic">Nội dung đang được cập nhật từ hệ thống...</p>' }}
                        />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 flex-shrink-0 flex-wrap">
                    {policy.pdf_url && (
                        <button
                            onClick={() => {
                                if (!policy.pdf_url) return;
                                const isDoc = policy.pdf_url.toLowerCase().endsWith('.docx') || policy.pdf_url.toLowerCase().endsWith('.doc');
                                const isLocal = window.location.hostname === 'localhost';
                                
                                if (isDoc) {
                                    if (isLocal) {
                                        alert("Tính năng xem trực tiếp file Word (.docx) yêu cầu link công khai. Trên bản Deploy (Render) sẽ xem được trực tiếp qua Google Docs Viewer. Ở bản máy cá nhân, file sẽ được tải về.");
                                        window.open(policy.pdf_url, '_blank');
                                    } else {
                                        // Construct absolute URL for Google Docs Viewer
                                        const fullUrl = window.location.origin + (policy.pdf_url.startsWith('/') ? '' : '/') + policy.pdf_url;
                                        window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`, '_blank');
                                    }
                                } else {
                                    // PDF or other - open normally
                                    window.open(policy.pdf_url, '_blank');
                                }
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-black transition-all shadow-sm active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                            Xem Bản Nguyên Văn ({policy.pdf_url.split('.').pop()?.toUpperCase()})
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-10 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>
    );
}

