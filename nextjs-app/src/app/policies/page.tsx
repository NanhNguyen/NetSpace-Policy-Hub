"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES } from "@/lib/data";
import PolicyCard from "@/components/PolicyCard";
import { PolicyService } from "@/lib/services/policy.service";
import { Policy } from "@/types";

const ALL_CATS = [
    { key: "all", label: "Tất cả" },
    ...Object.entries(CATEGORIES).map(([k, v]) => ({ key: k, label: v.label })),
];

function PoliciesContent() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState("default");
    const [filter, setFilter] = useState(searchParams.get("cat") || "all");
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await PolicyService.getAllPublished();
                setPolicies(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        let data = policies.filter((p) => {
            const catOk = filter === "all" || p.category === filter;
            const qOk =
                !search ||
                (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
            return catOk && qOk;
        });
        if (sort === "name") data = [...data].sort((a, b) => a.title.localeCompare(b.title, "vi"));
        else if (sort === "updated") data = [...data].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        return data;
    }, [search, sort, filter, policies]);

    if (loading) return <div className="py-20 text-center text-text-muted">Đang tải chính sách...</div>;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
                <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-text-main">Chính sách</span>
            </nav>

            <h1 className="text-3xl font-black text-text-main mb-1">Tất cả Chính sách</h1>
            <p className="text-text-muted text-sm mb-8">
                Tìm và đọc{" "}
                <span className="font-bold text-text-main">{filtered.length}</span> chính sách nội bộ hiện hành.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between border-b pb-8 border-neutral-soft">
                <div className="relative flex-1 max-w-lg">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                        search
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm chính sách, quy định..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-soft bg-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold text-text-muted whitespace-nowrap hidden sm:block">Sắp xếp:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="text-sm rounded-xl border border-neutral-soft bg-white px-4 py-3.5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text-main font-bold shadow-sm"
                    >
                        <option value="default">Mặc định</option>
                        <option value="name">Tên A-Z</option>
                        <option value="updated">Mới nhất</option>
                    </select>
                </div>
            </div>

            {/* Grouped by Category */}
            {filtered.length > 0 ? (
                <div className="space-y-16">
                    {Object.entries(CATEGORIES).map(([key, cat]) => {
                        const catPolicies = filtered.filter(p => p.category === key);
                        if (catPolicies.length === 0) return null;

                        return (
                            <section key={key} id={key} className="scroll-mt-24">
                                <div className="flex items-center gap-3 mb-8 text-text-main">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                        <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black leading-tight">{cat.label}</h2>
                                        <p className="text-xs text-text-muted mt-0.5">{cat.desc.substring(0, 100)}</p>
                                    </div>
                                    <div className="ml-auto h-[1px] bg-neutral-soft flex-1 ml-6 hidden md:block" />
                                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-text-muted/50 bg-neutral-soft/50 px-2 py-1 rounded">
                                        {catPolicies.length} POLICY
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {catPolicies.map((p) => (
                                        <PolicyCard key={p.id} policy={p} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}

                    {/* Handle policies with other categories */}
                    {(() => {
                        const knownCats = Object.keys(CATEGORIES);
                        const otherPolicies = filtered.filter(p => !knownCats.includes(p.category));
                        if (otherPolicies.length === 0) return null;

                        return (
                            <section id="other" className="scroll-mt-24">
                                <div className="flex items-center gap-3 mb-8 text-text-main">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200">
                                        <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black leading-tight">Chính sách khác</h2>
                                        <p className="text-xs text-text-muted mt-0.5">Các quy định và hướng dẫn bổ sung khác.</p>
                                    </div>
                                    <div className="ml-auto h-[1px] bg-neutral-soft flex-1 ml-6 hidden md:block" />
                                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-text-muted/50 bg-neutral-soft/50 px-2 py-1 rounded">
                                        {otherPolicies.length} POLICY
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherPolicies.map((p) => (
                                        <PolicyCard key={p.id} policy={p} />
                                    ))}
                                </div>
                            </section>
                        );
                    })()}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-soft">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-[48px] text-slate-300">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy chính sách nào</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">
                        Hãy thử lại với từ khóa khác hoặc liên hệ bộ phận HR để được hỗ trợ.
                    </p>
                    <button
                        onClick={() => setSearch("")}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                    >
                        Xóa tìm kiếm
                    </button>
                </div>
            )}
        </main>
    );
}

export default function PoliciesPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-text-muted">Đang tải...</div>}>
            <PoliciesContent />
        </Suspense>
    );
}
