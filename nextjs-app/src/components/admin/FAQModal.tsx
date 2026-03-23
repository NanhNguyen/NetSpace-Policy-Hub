"use client";

import { FAQ } from "@/types";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FAQModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (faq: Partial<FAQ>) => Promise<void>;
    faq?: FAQ | null;
}

export default function FAQModal({ open, onClose, onSave, faq }: FAQModalProps) {
    const [formData, setFormData] = useState<Partial<FAQ>>({
        question: "",
        answer: "",
        category: "Chung",
        published: true,
        order_index: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (faq) {
            setFormData(faq);
        } else {
            setFormData({
                question: "",
                answer: "",
                category: "Chung",
                published: true,
                order_index: 0
            });
        }
    }, [faq, open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Đã có lỗi xảy ra khi lưu FAQ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 pl-68">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out fill-mode-forwards">
                <div className="flex flex-col items-center justify-center p-8 border-b border-neutral-soft bg-white/50 relative">
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-slate-900">
                            {faq ? "Chỉnh sửa FAQ" : "Thêm FAQ mới"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="absolute right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Câu hỏi</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold placeholder:text-slate-300"
                                placeholder="Nhập câu hỏi..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Câu trả lời</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold placeholder:text-slate-300"
                                placeholder="Nhập câu trả lời chi tiết..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Danh mục</label>
                            <input
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold placeholder:text-slate-300"
                                placeholder="VD: Nhân sự, IT..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Thứ tự hiển thị</label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border border-neutral-soft rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Trạng thái</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, published: !formData.published })}
                                    className={`w-full py-4 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.published
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {formData.published ? '✓ Phát hành' : '○ Bản nháp'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-10 py-3.5 rounded-2xl font-black text-sm text-text-muted hover:bg-slate-100 transition-colors border border-slate-100"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-12 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
