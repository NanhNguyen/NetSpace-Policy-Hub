import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Danh mục Chính sách" };

export default function CategoriesPage() {
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
                        className="category-card bg-white rounded-2xl border border-neutral-soft p-7 group block"
                    >
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-text-main text-[28px] transition-colors">
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
            <div className="bg-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-5">
                <div>
                    <h2 className="text-xl font-black text-text-main mb-1">Không tìm thấy thứ bạn cần?</h2>
                    <p className="text-text-main/70 text-sm">Đội HR luôn sẵn sàng hỗ trợ bạn trong vòng 24 giờ làm việc.</p>
                </div>
                <Link
                    href="/faq"
                    className="flex items-center gap-2 bg-text-main text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 whitespace-nowrap flex-shrink-0"
                >
                    <span className="material-symbols-outlined text-[18px]">help</span>Xem FAQ
                </Link>
            </div>
        </main>
    );
}
