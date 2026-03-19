"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UPDATES, CATEGORIES } from "@/lib/data";
import HRModal from "@/components/HRModal";
import PolicyCard from "@/components/PolicyCard";
import { PolicyService } from "@/lib/services/policy.service";
import { Policy } from "@/types";
import { supabase } from "@/lib/db/client";

const QUICK_SUGGESTIONS = ["Làm việc từ xa", "Nghỉ phép", "Bảo mật IT", "Quy tắc ứng xử", "Hoàn chi phí"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [popularPolicies, setPopularPolicies] = useState<Policy[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>(UPDATES.slice(0, 5));
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleAskHR = () => {
    if (!user) {
      router.push("/auth/login?redirect=ask-hr");
      return;
    }
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const policies = await PolicyService.getAllPublished();
        setPopularPolicies(policies.slice(0, 5));
        // We can also fetch real updates if we had an updates table
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
      }
    };
    fetchData();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;

    // Log search query (non-blocking)
    fetch('/api/search-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.trim(), resultCount: 0 }),
    }).catch(() => { });

    router.push(`/policies?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative py-28 overflow-hidden bg-white" aria-label="Tìm kiếm chính sách">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-brand-blue rounded-full opacity-[0.08] blur-[100px]" />
          <div className="absolute bottom-0 -left-16 w-[400px] h-[400px] bg-brand-purple rounded-full opacity-[0.08] blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-8">
            <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">verified</span>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">NetSpace Internal Policy Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.05] text-slate-900">
            Tìm Chính sách Công ty<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-primary to-brand-blue">Trong Vài Giây</span>
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Trung tâm tra cứu chính sách nội bộ NetSpace. Mọi quy định, hướng dẫn và phúc lợi — tất cả ở một nơi, chuyên nghiệp và minh bạch.
          </p>
          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto group" role="search">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl blur-lg opacity-20 transition duration-500 group-focus-within:opacity-40" />
            <div className="relative flex bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden p-1.5">
              <div className="flex items-center pl-4 text-slate-400">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm kiếm chính sách, quy định, từ khóa..."
                className="w-full py-4 px-4 bg-transparent border-none focus:ring-0 text-base font-bold placeholder:text-slate-400/60 outline-none"
                aria-label="Tìm kiếm chính sách"
              />
              <button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary-dark text-white px-8 rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/30 active:scale-95 flex-shrink-0"
              >
                Tìm ngay
              </button>
            </div>
          </div>
          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest pt-1 mr-2">Gợi ý:</span>
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white text-slate-500 rounded-xl font-bold transition-all border border-slate-100 shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-y border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { icon: "description", text: "12 chính sách", color: "text-brand-blue" },
            { icon: "category", text: "6 danh mục", color: "text-primary" },
            { icon: "update", text: "Cập nhật tháng 3/2026", color: "text-brand-purple" },
            { icon: "support_agent", text: "HR sẵn sàng hỗ trợ", color: "text-indigo-500" },
          ].map(({ icon, text, color }) => (
            <div key={icon} className="flex items-center gap-2.5 group cursor-default">
              <div className={`w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center transition-all group-hover:bg-slate-100`}>
                <span className={`material-symbols-outlined ${color} text-[20px]`}>{icon}</span>
              </div>
              <span className="text-sm font-black text-slate-700 tracking-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* CATEGORIES */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="categories-heading">
          <div className="flex items-end justify-between mb-12 border-l-4 border-primary pl-6">
            <div>
              <h2 id="categories-heading" className="text-3xl font-black text-slate-900 tracking-tight">Chính Sách</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Khám phá các quy định theo chủ đề</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
              Xem tất cả <span className="material-symbols-outlined text-[18px]">east</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/policies?cat=${key}`}
                className="category-card group bg-white p-6 rounded-2xl border border-slate-100 cursor-pointer text-left block hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">{cat.icon}</span>
                </div>
                <h3 className="font-black text-sm mb-1 text-slate-900 leading-tight">{cat.label}</h3>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{cat.desc.substring(0, 35)}...</p>
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR + UPDATES */}
        <section className="py-16 bg-background" aria-label="Chính sách phổ biến và Cập nhật">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Popular */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-main">Chính sách Phổ biến</h2>
                <Link href="/policies" className="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
                  Tất cả <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {popularPolicies.map((p) => (
                  <PolicyCard key={p.id} policy={p} variant="compact" />
                ))}
              </div>
            </div>

            {/* Updates Timeline */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text-main">Cập nhật Mới nhất</h2>
                <Link href="/updates" className="flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
                  Tất cả <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="relative space-y-7">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-neutral-soft" />
                {recentUpdates.map((u, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-bg-light ${i === 0 ? "bg-primary" : "bg-slate-200"}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${i === 0 ? "text-primary" : "text-text-muted"}`}>
                      {u.date}
                    </span>
                    <h3 className="font-bold text-sm mt-0.5 text-text-main">{u.title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{u.desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/updates"
                className="mt-6 w-full py-3 bg-neutral-soft text-text-main text-sm font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2 block text-center"
              >
                <span className="material-symbols-outlined text-[18px]">update</span>
                Xem tất cả cập nhật
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20 text-white relative overflow-hidden">
            {/* Background blobs for depth */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-3xl -ml-32 -mb-32 rounded-full" />

            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-3xl font-black mb-3">Bạn không tìm thấy câu trả lời?</h2>
              <p className="text-white/80 font-bold max-w-md">Liên hệ trực tiếp với đội ngũ HR của NetSpace để được giải đáp thắc mắc chi tiết.</p>
            </div>
            <button
              onClick={handleAskHR}
              className="relative z-10 whitespace-nowrap px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95"
            >
              Gửi yêu cầu ngay
            </button>
          </div>
        </section>
      </main>

      <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
