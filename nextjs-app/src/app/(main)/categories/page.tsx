"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import HRModal from "@/components/HRModal";

export default function CategoriesPage() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
                <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-text-main">Danh mục</span>
            </nav>
            <h1 className="text-3xl font-black text-text-main mb-2">Chính Sách</h1>
            <p className="text-text-muted text-sm mb-10">Duyệt qua 6 lĩnh vực chính sách để tìm thông tin nhanh hơn.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <Link
                        key={key}
                        href={`/policies?cat=${key}`}
                        className="category-card bg-white rounded-2xl border border-neutral-soft p-7 group block hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5"
                    >
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white text-[28px] transition-colors">
                                {cat.icon}
                            </span>
                        </div>
                        <h2 className="text-lg font-black text-text-main mb-2">{cat.label}</h2>
                        <p className="text-sm text-text-muted leading-relaxed mb-4">{cat.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-muted bg-neutral-soft px-3 py-1 rounded-full">
                                {cat.count} chính sách
                            </span>
                            <span className="material-symbols-outlined text-primary text-[20px]">arrow_forward</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl font-black mb-2">Bạn có câu hỏi cụ thể?</h2>
                    <p className="text-white/80 font-bold max-w-sm">Liên hệ trực tiếp với bộ phận nhân sự để được giải đáp thắc mắc của bạn.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="relative z-10 px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                    Hỏi HR ngay
                </button>
            </div>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </main>
    );
}
