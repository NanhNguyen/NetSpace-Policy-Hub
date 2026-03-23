"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FAQS } from "@/lib/data";
import HRModal from "@/components/HRModal";
import TicketStatusModal from "@/components/TicketStatusModal";
import { Search, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/db/client";

const FAQ_CATS = [
    { key: "all", label: "Tất cả" },
    { key: "hr", label: "Nhân sự" },
    { key: "leave", label: "Nghỉ phép" },
    { key: "it", label: "IT & Bảo mật" },
    { key: "finance", label: "Tài chính" },
];

export default function FAQPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [cat, setCat] = useState("all");
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [checkModalOpen, setCheckModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    const handleAskHR = () => {
        if (!user) {
            router.push("/auth/login?redirect=faq");
            return;
        }
        setModalOpen(true);
    };

    const filtered = useMemo(
        () =>
            FAQS.filter((f) => {
                const catOk = cat === "all" || f.cat === cat;
                const qOk =
                    !search ||
                    f.q.toLowerCase().includes(search.toLowerCase()) ||
                    f.a.toLowerCase().includes(search.toLowerCase());
                return catOk && qOk;
            }),
        [search, cat]
    );

    function toggle(i: number) {
        setOpenIdx(openIdx === i ? null : i);
    }

    return (
        <>
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <nav className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="font-semibold text-text-main">FAQ</span>
                    </div>
                    <button
                        onClick={() => setCheckModalOpen(true)}
                        className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                    >
                        <Search size={14} />
                        Tra cứu thắc mắc
                    </button>
                </nav>
                <h1 className="text-3xl font-black text-text-main mb-2">Câu hỏi Thường gặp</h1>
                <p className="text-text-muted text-sm mb-10">
                    Những thắc mắc phổ biến nhất của nhân viên về chính sách và quyền lợi tại NetSpace.
                </p>

                {/* Search */}
                <div className="relative mb-8">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                        search
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm câu hỏi..."
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-neutral-soft bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>

                {/* Popular Questions Header */}
                <div className="flex items-center gap-2 mb-6 ml-1">
                    <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                    <h2 className="text-sm font-bold text-text-main uppercase tracking-wider">Câu hỏi được hỏi nhiều nhất</h2>
                </div>

                {/* Accordion */}
                {filtered.length > 0 ? (
                    <div className="space-y-3">
                        {filtered.map((faq, i) => (
                            <div
                                key={i}
                                className={`bg-white rounded-xl border overflow-hidden transition-colors ${openIdx === i ? "border-primary" : "border-neutral-soft"
                                    }`}
                            >
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-center justify-between text-left px-5 py-4 gap-4"
                                >
                                    <span className="font-semibold text-sm text-text-main leading-snug">{faq.q}</span>
                                    <span
                                        className={`material-symbols-outlined flex-shrink-0 text-text-muted text-[22px] transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""
                                            }`}
                                    >
                                        expand_more
                                    </span>
                                </button>
                                <div
                                    className="overflow-hidden transition-all duration-300 ease-in-out"
                                    style={{ maxHeight: openIdx === i ? "400px" : "0" }}
                                >
                                    <div className="px-5 pb-5 pt-0 text-sm text-text-muted leading-relaxed border-t border-neutral-soft pt-4">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-text-muted text-sm">
                        <span className="material-symbols-outlined text-[40px] text-neutral-soft block mb-2">search_off</span>
                        Không tìm thấy câu hỏi phù hợp.{" "}
                        <button onClick={handleAskHR} className="text-primary font-bold hover:underline">
                            Hỏi HR trực tiếp
                        </button>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 mb-20 bg-primary rounded-3xl p-10 text-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 blur-3xl -ml-24 -mt-24 rounded-full" />
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-white text-[48px] mb-4 block">support_agent</span>
                        <h2 className="text-2xl font-black mb-2">Vẫn chưa tìm được câu trả lời?</h2>
                        <p className="text-white/80 font-bold mb-8 max-w-sm mx-auto">Nếu danh sách FAQ không giải đáp được thắc mắc, hãy gửi câu hỏi trực tiếp cho đội ngũ HR.</p>
                        <button
                            onClick={handleAskHR}
                            className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            Gửi câu hỏi cho HR ngay
                        </button>
                    </div>
                </div>
            </main>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <TicketStatusModal open={checkModalOpen} onClose={() => setCheckModalOpen(false)} />
        </>
    );
}
