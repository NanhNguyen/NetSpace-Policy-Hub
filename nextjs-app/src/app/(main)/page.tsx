"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UPDATES, CATEGORIES } from "@/lib/data";
import HRModal from "@/components/HRModal";
import PolicyCard from "@/components/PolicyCard";
import { PolicyService } from "@/lib/services/policy.service";
import { KeywordService } from "@/lib/services/keyword.service";
import { Policy } from "@/types";
import { supabase } from "@/lib/db/client";



export default function HomePage() {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
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
        const [policies, keywordsData] = await Promise.all([
          PolicyService.getAllPublished(),
          KeywordService.getActive().catch(() => [])
        ]);
        setPopularPolicies(policies.slice(0, 5));
        if (keywordsData) {
          setSuggestedKeywords(keywordsData.map((k: any) => k.word));
        }
        // We can also fetch real updates if we had an updates table
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
      }
    };
    fetchData();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    router.push(`/policies?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative py-32 sm:py-40 overflow-hidden bg-white/50" aria-label="Tìm kiếm chính sách">
        {/* Futuristic Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary rounded-full opacity-[0.05] blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-blue rounded-full opacity-[0.05] blur-[100px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.1] mix-blend-overlay" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full px-5 py-2 mb-10 shadow-sm transition-transform hover:scale-105">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">NetSpace Internal Policy Hub</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] text-slate-900">
            <span className="text-gradient text-glow">Nội Quy và<br />Quy Định</span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Nền tảng số hóa chính sách — Truy cập nhanh, minh bạch và thông minh dành cho mọi nhân sự NetSpace.
          </p>

          {/* Search bar with floating effect */}
          <div className="relative max-w-2xl mx-auto group" role="search">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-brand-blue to-brand-purple rounded-[2rem] blur-xl opacity-20 transition duration-700 group-focus-within:opacity-40 group-hover:opacity-30" />
            <div className="relative flex bg-white/90 backdrop-blur-2xl rounded-[1.75rem] border border-white shadow-2xl overflow-hidden p-2">
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
          {/* Suggestions with higher highlight */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-14 bg-white/40 p-1 rounded-[2.5rem] border border-white/60 shadow-xl max-w-3xl mx-auto backdrop-blur-md ring-1 ring-primary/20">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 group">
              <span className="material-symbols-outlined text-[18px] animate-pulse">auto_awesome</span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap">Từ khóa HOT</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedKeywords.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    router.push(`/policies?q=${encodeURIComponent(s)}`);
                  }}
                  className="group relative flex items-center gap-1.5 text-xs px-5 py-2.5 bg-white hover:bg-primary hover:text-white text-slate-600 rounded-2xl font-black transition-all border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-95"
                >
                  <span className="text-primary group-hover:text-white/50 text-[10px] transition-colors">#</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white/40 backdrop-blur-md border-y border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-center gap-8 sm:gap-20">
          {[
            { icon: "description", text: "12 chính sách", color: "text-brand-blue" },
            { icon: "category", text: "6 danh mục", color: "text-primary" },
            { icon: "update", text: "Cập nhật tháng 3/2026", color: "text-brand-purple" },
            { icon: "support_agent", text: "HR sẵn sàng hỗ trợ", color: "text-indigo-500" },
          ].map(({ icon, text, color }) => (
            <div key={icon} className="flex items-center gap-3 group cursor-default">
              <div className={`w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-md group-hover:border-primary/20`}>
                <span className={`material-symbols-outlined ${color} text-[22px]`}>{icon}</span>
              </div>
              <span className="text-sm font-black text-slate-800 tracking-tight transition-colors group-hover:text-primary">{text}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/policies?cat=${key}`}
                className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 cursor-pointer text-left block transition-all hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:-translate-y-2 overflow-hidden active:scale-[0.98]"
              >
                {/* Decorative background number/icon */}
                <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all">
                  <span className="material-symbols-outlined text-[100px]">{cat.icon}</span>
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-sm ring-4 ring-slate-50 group-hover:ring-primary/10">
                    <span className="material-symbols-outlined text-primary group-hover:text-white text-[28px] transition-colors">{cat.icon}</span>
                  </div>
                  <h3 className="font-black text-xl mb-3 text-slate-900 leading-tight group-hover:text-primary transition-colors">{cat.label}</h3>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed mb-8">{cat.desc}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 group-hover:border-primary/10 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-primary transition-colors delay-75">Khám phá ngay</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:translate-x-1">
                      <span className="material-symbols-outlined text-[18px]">east</span>
                    </div>
                  </div>
                </div>
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
        <section className="mt-20 mb-20 px-4 sm:px-6">
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
