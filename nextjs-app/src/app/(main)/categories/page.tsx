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
            <h1 className="text-3xl font-black text-text-main mb-2">Danh mục Chính sách</h1>
            <p className="text-text-muted text-sm mb-10">Duyệt qua 6 lĩnh vực chính sách để tìm thông tin nhanh hơn.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <Link
                        key={key}
                        href={`/policies?cat=${key}`}
                        className="category-card bg-white rounded-3xl sm:rounded-2xl border border-neutral-soft p-10 sm:p-7 group block hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white text-[40px] transition-colors">
                                {cat.icon}
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-lg font-black text-text-main mb-3 sm:mb-2">{cat.label}</h2>
                        <p className="text-base sm:text-sm text-text-muted leading-relaxed mb-6 sm:mb-4">{cat.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-muted bg-neutral-soft px-3 py-1.5 rounded-full">
                                Xem chi tiết
                            </span>
                            <span className="material-symbols-outlined text-primary text-[24px] sm:text-[20px]">arrow_forward</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CTA */}
            <div className="mb-20 bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
                <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl font-black mb-2">Bạn có câu hỏi cụ thể?</h2>
                    <p className="text-white/80 font-bold max-w-sm">Liên hệ trực tiếp với bộ phận nhân sự để được giải đáp thắc mắc của bạn.</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="relative z-10 px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-white hover:shadow-[0_20px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 shadow-xl active:scale-95 whitespace-nowrap"
                >
                    Hỏi HR ngay
                </button>
            </div>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </main>
    );
}
