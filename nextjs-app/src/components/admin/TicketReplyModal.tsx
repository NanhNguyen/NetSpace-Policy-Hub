"use client";

import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { Ticket } from "@/types";

interface TicketReplyModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (id: string, answer: string) => Promise<void>;
    ticket: Ticket | null;
}

export default function TicketReplyModal({ open, onClose, onSave, ticket }: TicketReplyModalProps) {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ticket) {
            setAnswer(ticket.answer || "");
        }
    }, [ticket, open]);

    if (!open || !ticket) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) return;
        setLoading(true);
        try {
            await onSave(ticket.id, answer);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Đã có lỗi xảy ra khi gửi câu trả lời.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-neutral-soft bg-slate-50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Phản hồi thắc mắc</h2>
                        <p className="text-xs text-text-muted mt-1">Gửi từ: <span className="font-bold text-slate-700">{ticket.employee_name} ({ticket.employee_email})</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-neutral-soft">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Câu hỏi của nhân viên</label>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                            "{ticket.question}"
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Nội dung phản hồi</label>
                            <textarea
                                required
                                rows={6}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-4 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-medium"
                                placeholder="Nhập câu trả lời chi tiết cho nhân viên..."
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-text-muted hover:bg-slate-100 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !answer.trim()}
                                className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                <Send size={16} />
                                {loading ? "Đang gửi..." : "Gửi câu trả lời"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
