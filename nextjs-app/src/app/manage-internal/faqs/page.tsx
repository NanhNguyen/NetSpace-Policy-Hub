"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, HelpCircle } from "lucide-react";
import { FAQService } from "@/lib/services/faq.service";
import { FAQ } from "@/types";
import FAQModal from "@/components/admin/FAQModal";

export default function AdminFAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState<Partial<FAQ>>({});

    const loadFaqs = async () => {
        setLoading(true);
        try {
            const data = await FAQService.getAll();
            setFaqs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaqs();
    }, []);

    const handleAdd = () => {
        setSelectedFaq(null);
        setFormData({
            question: "",
            answer: "",
            category: "Chung",
            published: true,
            order_index: faqs.length > 0 ? Math.max(...faqs.map(f => f.order_index || 0)) + 1 : 1
        });
        setIsModalOpen(true);
    };

    const handleEdit = (faq: FAQ) => {
        setSelectedFaq(faq);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa FAQ này?")) return;
        try {
            await FAQService.delete(id);
            setFaqs(faqs.filter(f => f.id !== id));
        } catch (error) {
            alert("Xóa không thành công.");
        }
    };

    const handleSave = async (faqData: Partial<FAQ>) => {
        try {
            if (selectedFaq) {
                await FAQService.update(selectedFaq.id, faqData);
            } else {
                await FAQService.create(faqData);
            }
            await loadFaqs();
        } catch (error) {
            console.error("Save FAQ failed:", error);
            alert("Lỗi khi lưu dữ liệu.");
        }
    };



    const filtered = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <HelpCircle className="text-primary" />
                        Quản lý FAQs
                    </h1>
                    <p className="text-sm text-text-muted">Tạo và chỉnh sửa các câu hỏi thường gặp cho nhân viên.</p>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        <Plus size={18} />
                        Thêm FAQ
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-soft overflow-hidden">
                <div className="p-6 border-b border-neutral-soft">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-neutral-soft">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Thứ tự</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Câu hỏi & Trả lời</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-soft text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-text-muted">Đang xử lý dữ liệu...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-text-muted">Không tìm thấy FAQ nào.</td>
                                </tr>
                            ) : filtered.map((faq) => (
                                <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-400">#{faq.order_index}</td>
                                    <td className="px-6 py-4 max-w-lg">
                                        <div className="font-bold text-slate-900 mb-1">{faq.question}</div>
                                        <div className="text-xs text-text-muted line-clamp-3 leading-relaxed">{faq.answer}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(faq)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <FAQModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                faq={selectedFaq || (formData as FAQ)}
                onSave={handleSave}
            />
        </div>
    );
}
