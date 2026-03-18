"use client";

import { useState } from "react";
import Link from "next/link";
import { UPDATES } from "@/lib/data";

type FilterType = "all" | "new" | "updated";

export default function UpdatesPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const filtered = UPDATES.filter(
        (u) => activeFilter === "all" || u.type === activeFilter
    );

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
                <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-text-main">Cập nhật</span>
            </nav>
            <h1 className="text-3xl font-black text-text-main mb-2">Cập nhật Chính sách</h1>
            <p className="text-text-muted text-sm mb-10">
                Lịch sử thay đổi và bổ sung các chính sách nội bộ — đảm bảo bạn không bỏ lỡ thông tin quan trọng.
            </p>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap mb-8">
                {([
                    { key: "all", label: "Tất cả" },
                    { key: "new", label: "Chính sách Mới" },
                    { key: "updated", label: "Đã Cập nhật" },
                ] as { key: FilterType; label: string }[]).map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`text-xs px-4 py-2 rounded-full border font-bold transition-all ${activeFilter === key
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "border-neutral-soft bg-white text-text-muted hover:border-primary"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="absolute left-4 top-2 bottom-4 w-0.5 bg-neutral-soft" />
                <div className="space-y-6">
                    {filtered.map((u, i) => {
                        const isNew = u.type === "new";
                        return (
                            <div key={i} className="relative pl-12">
                                <div
                                    className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-bg-light flex items-center justify-center ${i === 0 ? "bg-primary" : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`material-symbols-outlined text-[14px] ${i === 0 ? "text-white" : "text-slate-400"}`}
                                    >
                                        {isNew ? "add" : "edit"}
                                    </span>
                                </div>
                                <div className="bg-white rounded-xl border border-neutral-soft p-5 hover:shadow-card-hover transition-shadow">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${isNew ? "bg-green-100 text-green-700" : "bg-primary/20 text-text-muted"
                                                }`}
                                        >
                                            {isNew ? "Mới" : "Cập nhật"}
                                        </span>
                                        <span className="px-2 py-0.5 bg-neutral-soft text-text-muted text-[10px] font-bold uppercase rounded-full">
                                            {u.cat}
                                        </span>
                                        <span className="text-[11px] text-text-muted ml-auto">{u.date}</span>
                                    </div>
                                    <h2 className="font-bold text-sm text-text-main mb-1.5">{u.title}</h2>
                                    <p className="text-xs text-text-muted leading-relaxed mb-3">{u.desc}</p>
                                    <Link
                                        href={u.link}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                    >
                                        Đọc chính sách{" "}
                                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
