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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-neutral-soft bg-slate-50">
                    <h2 className="text-xl font-black text-slate-900">
                        {faq ? "Chỉnh sửa FAQ" : "Thêm FAQ mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Câu hỏi</label>
                        <textarea
                            required
                            rows={2}
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                            placeholder="Nhập câu hỏi..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Câu trả lời</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                            placeholder="Nhập câu trả lời chi tiết..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Danh mục</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                        <input
                            type="checkbox"
                            role="switch"
                            id="faq-published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-5 h-5 accent-primary cursor-pointer"
                        />
                        <label htmlFor="faq-published" className="text-sm font-bold text-slate-700 cursor-pointer">Công khai lên web</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm text-text-muted hover:bg-slate-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
