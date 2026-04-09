import { useState } from "react";
import Link from "next/link";
import { Policy } from "@/types";
import { CATEGORIES } from "@/lib/data";
import PolicyViewModal from "./PolicyViewModal";

interface PolicyCardProps {
    policy: Policy;
    variant?: "default" | "compact";
}

export default function PolicyCard({ policy, variant = "default" }: PolicyCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const catLabel = CATEGORIES[policy.category as keyof typeof CATEGORIES]?.label || policy.category;
    const dateStr = new Date(policy.updated_at).toLocaleDateString('vi-VN');

    if (variant === "compact") {
        return (
            <>
                <div className="tech-card p-6 flex flex-col justify-between group active:scale-[0.98]">
                    <div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                                {catLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                {dateStr}
                            </span>
                        </div>
                        <h3 className="text-base font-black mb-2 text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">{policy.title}</h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed line-clamp-2 font-medium group-hover:text-slate-600 transition-colors">{policy.excerpt}</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="group/btn w-full py-3 bg-slate-50 border border-slate-100 text-slate-400 font-black rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2"
                    >
                        Chi tiết <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">east</span>
                    </button>
                </div>
                {modalOpen && <PolicyViewModal policy={policy} onClose={() => setModalOpen(false)} />}
            </>
        );
    }

    return (
        <>
            <div className="tech-card p-8 group active:scale-[0.98] reveal-on-scroll">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-inner ring-4 ring-slate-50 group-hover:ring-primary/10">
                        <span className="material-symbols-outlined text-primary group-hover:text-white text-[28px] transition-colors">{policy.icon}</span>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                        {catLabel}
                    </span>
                </div>
                
                <h2 className="font-black text-xl mb-3 text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{policy.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3 font-medium transition-colors group-hover:text-slate-600">{policy.excerpt}</p>
                
                <div className="flex items-center gap-2 mb-8 font-bold text-[10px] text-slate-400 tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    Cập nhật vào {dateStr}
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all text-[11px] uppercase tracking-[0.1em] text-center flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30"
                >
                    Đọc quy định trang nội bộ <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </button>
            </div>
            {modalOpen && <PolicyViewModal policy={policy} onClose={() => setModalOpen(false)} />}
        </>
    );
}
