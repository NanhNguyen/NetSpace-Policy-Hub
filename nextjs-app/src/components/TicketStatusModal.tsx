"use client";

import { useState } from "react";
import { Search, X, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { TicketService } from "@/lib/services/ticket.service";
import { Ticket } from "@/types";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function TicketStatusModal({ open, onClose }: Props) {
    const [email, setEmail] = useState("");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        try {
            const data = await TicketService.getByEmail(email);
            setTickets(data);
            setSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="relative flex items-center justify-between p-6 border-b border-neutral-soft bg-slate-50">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Search className="text-primary" />
                        Tra cứu thắc mắc
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="absolute right-0 top-0 w-20 h-full flex items-center justify-center transition-all active:scale-90 cursor-pointer group" 
                        aria-label="Đóng"
                    >
                        <div className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full transition-colors text-slate-400 group-hover:text-slate-900">
                            <span className="material-symbols-outlined text-[24px]">close</span>
                        </div>
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                        <div className="relative flex-1">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email công ty của bạn..."
                                className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                        >
                            {loading ? "Đang tìm..." : "Kiểm tra"}
                        </button>
                    </form>

                    <div className="max-h-[400px] overflow-y-auto space-y-4 pr-1">
                        {!searched ? (
                            <div className="text-center py-10 text-text-muted">
                                <p className="text-sm">Vui lòng nhập email để xem lịch sử câu hỏi của bạn.</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-10 text-text-muted font-medium">
                                Không tìm thấy thắc mắc nào cho email này.
                            </div>
                        ) : (
                            tickets.map((t) => (
                                <div key={t.id} className="p-4 rounded-xl border border-neutral-soft bg-slate-50/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${t.status === 'open' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {t.status === 'open' ? 'Đang xử lý' : 'Đã trả lời'}
                                        </span>
                                        <span className="text-[10px] text-text-muted font-bold flex items-center gap-1">
                                            <Clock size={12} /> {new Date(t.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 leading-relaxed italic">
                                        Q: "{t.question}"
                                    </p>
                                    {t.answer ? (
                                        <div className="bg-white p-3 rounded-lg border border-green-100 text-xs text-slate-700 leading-relaxed">
                                            <div className="flex items-center gap-1.5 text-green-600 font-black uppercase tracking-tighter mb-1 text-[9px]">
                                                <CheckCircle2 size={12} /> HR Phản hồi:
                                            </div>
                                            {t.answer}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-text-muted italic">HR đang soạn câu trả lời cho bạn...</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
