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
                <div className="policy-card bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                    <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                                {catLabel}
                            </span>
                            <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold">
                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                {dateStr}
                            </span>
                        </div>
                        <h3 className="text-base font-black mb-2 text-slate-900 leading-tight">{policy.title}</h3>
                        <p className="text-sm text-text-muted mb-4 leading-relaxed line-clamp-2 font-medium">{policy.excerpt}</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-full py-2.5 bg-slate-50 border border-slate-100 text-primary font-black rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all text-xs uppercase tracking-widest text-center block active:scale-95"
                    >
                        Chi tiết
                    </button>
                </div>
                {modalOpen && <PolicyViewModal policy={policy} onClose={() => setModalOpen(false)} />}
            </>
        );
    }

    return (
        <>
            <div className="policy-card bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                <div>
                    <div className="flex items-start justify-between gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                            <span className="material-symbols-outlined text-primary group-hover:text-white text-[24px] transition-colors">{policy.icon}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg border border-slate-100">
                            {catLabel}
                        </span>
                    </div>
                    <h2 className="font-black text-lg mb-2 text-slate-900 leading-tight group-hover:text-primary transition-colors">{policy.title}</h2>
                    <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3 font-medium">{policy.excerpt}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-6 font-bold">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        Cập nhật {dateStr}
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-3.5 bg-primary border border-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all text-xs uppercase tracking-[0.15em] text-center block shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                >
                    Xem quy định
                </button>
            </div>
            {modalOpen && <PolicyViewModal policy={policy} onClose={() => setModalOpen(false)} />}
        </>
    );
}
