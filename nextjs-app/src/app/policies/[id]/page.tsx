"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";
import { CATEGORIES } from "@/lib/data";
import HRModal from "@/components/HRModal";
import { PolicyService } from "@/lib/services/policy.service";
import { Policy } from "@/types";

export default function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = use(params);
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await PolicyService.getBySlug(slug);
                setPolicy(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) return <div className="py-20 text-center text-text-muted">Đang tải...</div>;
    if (!policy) notFound();

    function copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    const catLabel = CATEGORIES[policy.category as keyof typeof CATEGORIES]?.label || policy.category;


    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <Link href="/policies" className="hover:text-primary transition-colors">Chính sách</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="font-semibold text-text-main line-clamp-1">{policy.title}</span>
                </nav>

                <div className="flex gap-10">
                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Meta */}
                        <div className="bg-white rounded-2xl border border-neutral-soft p-6 sm:p-8 mb-6">
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <span className="px-3 py-1 bg-primary/20 text-text-muted text-xs font-bold uppercase tracking-wider rounded-full">
                                    {catLabel}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                    Hiệu lực
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-text-main mb-3 leading-snug">{policy.title}</h1>
                            <p className="text-text-muted leading-relaxed mb-6">{policy.excerpt}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-text-muted border-t border-neutral-soft pt-4">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">person</span>
                                    Chịu trách nhiệm: <strong className="text-text-main ml-1">Phòng Nhân sự (HR)</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    Cập nhật: <strong className="text-text-main ml-1">{new Date(policy.updated_at).toLocaleDateString('vi-VN')}</strong>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">event</span>
                                    Hiệu lực từ: <strong className="text-text-main ml-1">{new Date(policy.created_at).toLocaleDateString('vi-VN')}</strong>
                                </span>
                            </div>
                            <div className="flex gap-3 mt-5 flex-wrap">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors border border-neutral-soft px-4 py-2 rounded-lg no-print"
                                >
                                    <span className="material-symbols-outlined text-[18px]">print</span>In
                                </button>
                                <button
                                    onClick={copyLink}
                                    className={`flex items-center gap-2 text-sm font-semibold transition-colors border border-neutral-soft px-4 py-2 rounded-lg no-print ${copied ? "text-primary border-primary" : "text-text-muted hover:text-primary"}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{copied ? "check" : "link"}</span>
                                    {copied ? "Đã sao chép" : "Sao chép link"}
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div
                            className="bg-white rounded-2xl border border-neutral-soft p-6 sm:p-8 mb-6 policy-content"
                            dangerouslySetInnerHTML={{ __html: policy.content }}
                        />

                        {/* Feedback */}
                        <div className="bg-white rounded-2xl border border-neutral-soft p-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                            <p className="text-sm font-semibold text-text-main">Tài liệu này có hữu ích không?</p>
                            {feedbackGiven === null ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFeedbackGiven(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-neutral-soft rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">thumb_up</span>Có
                                    </button>
                                    <button
                                        onClick={() => setFeedbackGiven(false)}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-neutral-soft rounded-lg text-sm font-semibold hover:border-red-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">thumb_down</span>Không
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-primary font-bold">✓ Cảm ơn phản hồi của bạn!</p>
                            )}
                        </div>
                    </div>

                    {/* TOC Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 no-print">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-xl border border-neutral-soft p-5">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Nội dung</h3>
                                <div className="text-sm text-text-muted space-y-2">
                                    {policy.content.match(/<h2>(.*?)<\/h2>/g)?.map((m: string, i: number) => {
                                        const text = m.replace(/<\/?h2>/g, "");
                                        return (
                                            <p key={i} className="py-1 border-l-2 border-neutral-soft pl-3 text-xs leading-snug">
                                                {text}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Câu hỏi?</h3>
                                <p className="text-xs text-text-muted leading-relaxed mb-3">Liên hệ HR nếu bạn cần hỗ trợ thêm.</p>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-text-main font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">support_agent</span>Hỏi HR
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <HRModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
