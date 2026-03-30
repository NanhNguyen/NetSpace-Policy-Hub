"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES } from "@/lib/data";
import PolicyCard from "@/components/PolicyCard";
import { PolicyService } from "@/lib/services/policy.service";
import { Policy } from "@/types";

function PoliciesContent() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState("default");
    const [filter, setFilter] = useState(searchParams.get("cat") || "all");
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    const categoriesList = useMemo(() => {
        // Group similar category names to prevent duplicate tabs (e.g., 'finance' and 'finances')
        const normalizedKeys = Array.from(new Set(policies.map(p => {
            const k = p.category.toLowerCase().trim();
            if (k === 'finances') return 'finance';
            return k;
        })));

        const list = [{ key: "all", label: "Tất cả" }];
        
        normalizedKeys.forEach(key => {
            const label = CATEGORIES[key as keyof typeof CATEGORIES]?.label || (key.charAt(0).toUpperCase() + key.slice(1));
            list.push({ key, label });
        });
        
        return list;
    }, [policies]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await PolicyService.getAllPublished();
                // If API returns empty, fallback to local data to prevent "0 result" issues
                if (data && data.length > 0) {
                    setPolicies(data);
                } else {
                    const { POLICIES: fallbackPolicies } = await import("@/lib/data");
                    // Map local layout to DB layout if needed
                    const mapped = (fallbackPolicies as any[]).map((p, i) => ({
                        id: p.id || i.toString(),
                        title: p.title,
                        category: p.cat || 'hr',
                        excerpt: p.desc || p.excerpt || '',
                        content: p.body || p.content || '',
                        published: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        icon: p.icon || 'description',
                        slug: p.id || 'policy-' + i
                    }));
                    setPolicies(mapped);
                }
            } catch (err) {
                console.error('Failed to load policies, using fallback:', err);
                const { POLICIES: fallbackPolicies } = await import("@/lib/data");
                setPolicies(fallbackPolicies as any);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();
        let data = policies.filter((p) => {
            const pCategory = p.category.toLowerCase().trim();
            const normalizedCat = pCategory === 'finances' ? 'finance' : pCategory;
            const catOk = filter === "all" || normalizedCat === filter.toLowerCase();
            
            if (!searchTerm) return catOk;

            const title = (p.title || "").toLowerCase();
            const excerpt = (p.excerpt || "").toLowerCase();
            const category = (p.category || "").toLowerCase();
            const catLabel = CATEGORIES[normalizedCat as keyof typeof CATEGORIES]?.label.toLowerCase() || "";

            const qOk = 
                title.includes(searchTerm) || 
                excerpt.includes(searchTerm) ||
                category.includes(searchTerm) ||
                catLabel.includes(searchTerm);

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
                {/* Search */}
                <div className="relative w-full sm:w-[400px]">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm chính sách, quy định..."
                        className="w-full pl-11 pr-4 py-3.5 bg-neutral-soft/30 border border-neutral-soft rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Filter */}
                    <div className="flex flex-wrap items-center bg-neutral-soft/30 p-1.5 rounded-2xl border border-neutral-soft flex-1 sm:flex-initial">
                        {categoriesList.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setFilter(cat.key)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat.key
                                    ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                                    : "text-text-muted hover:text-text-main"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort Select */}
                    <div className="relative min-w-[140px]">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-3.5 bg-neutral-soft/30 border border-neutral-soft rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        >
                            <option value="default">Sắp xếp</option>
                            <option value="name">Tên A-Z</option>
                            <option value="updated">Mới nhất</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[16px] pointer-events-none">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Grouped by Category */}
            {filtered.length > 0 ? (
                <div className="space-y-16">
                    {(() => {
                        const categoriesPresent = Array.from(new Set(filtered.map(p => {
                            const k = p.category.toLowerCase().trim();
                            return k === 'finances' ? 'finance' : k;
                        })));
                        
                        // Sort so that known categories come first, then others alphabetically
                        const knownCats = Object.keys(CATEGORIES);
                        const sortedCats = categoriesPresent.sort((a, b) => {
                            const aIdx = knownCats.indexOf(a);
                            const bIdx = knownCats.indexOf(b);
                            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                            if (aIdx !== -1) return -1;
                            if (bIdx !== -1) return 1;
                            return a.localeCompare(b, "vi");
                        });

                        return sortedCats.map((catKey) => {
                             const catPolicies = filtered.filter(p => {
                                 const k = p.category.toLowerCase().trim();
                                 return (k === 'finances' ? 'finance' : k) === catKey;
                             });
                            const meta = CATEGORIES[catKey as keyof typeof CATEGORIES] || { 
                                label: catKey === "conduct" ? "Nội quy" : 
                                       catKey === "benefits" ? "Phúc lợi" :
                                       (catKey.charAt(0).toUpperCase() + catKey.slice(1)), 
                                icon: catPolicies[0]?.icon || "description", 
                                desc: "Tập hợp các quy định và chính sách thuộc danh mục này." 
                            };

                            return (
                                <section key={catKey} id={catKey} className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-8 text-text-main">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                            <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black leading-tight">{meta.label}</h2>
                                            <p className="text-xs text-text-muted mt-0.5">{meta.desc.substring(0, 100)}</p>
                                        </div>
                                        <div className="ml-auto h-[1px] bg-neutral-soft flex-1 ml-6 hidden md:block" />
                                        <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-text-muted/50 bg-neutral-soft/50 px-2 py-1 rounded">
                                            {catPolicies.length} CHÍNH SÁCH
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {catPolicies.map((p) => (
                                            <PolicyCard key={p.id} policy={p} />
                                        ))}
                                    </div>
                                </section>
                            );
                        });
                    })()}
                </div>
            ) : (
                <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <span className="material-symbols-outlined text-[40px]">policy_search</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy kết quả</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm">Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm lại.</p>
                </div>
            )}
        </main>
    );
}

export default function PoliciesPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-text-muted italic">Đang tải nội dung...</div>}>
            <PoliciesContent />
        </Suspense>
    );
}
