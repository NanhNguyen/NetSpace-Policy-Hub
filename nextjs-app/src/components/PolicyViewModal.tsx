"use client";

import { X, Calendar, User } from 'lucide-react';
import { Policy } from '@/types';
import { CATEGORIES } from '@/lib/data';

interface PolicyViewModalProps {
    policy: Policy | null;
    onClose: () => void;
}

export default function PolicyViewModal({ policy, onClose }: PolicyViewModalProps) {
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
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 sm:px-8 py-6 sm:py-8 text-white relative overflow-hidden flex-shrink-0">
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
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white border border-white/10 active:scale-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
                    {/* Excerpt */}
                    {policy.excerpt && (
                        <div className="mx-4 sm:mx-8 mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-sm font-medium italic border-l-4 border-l-primary">
                            "{policy.excerpt}"
                        </div>
                    )}

                    {/* Policy HTML Content */}
                    <div
                        className="px-5 sm:px-8 py-6 policy-body"
                        dangerouslySetInnerHTML={{ __html: policy.content || '<p class="text-slate-400">Nội dung đang được cập nhật.</p>' }}
                    />
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-10 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black transition-all shadow-lg active:scale-95"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>
    );
}
