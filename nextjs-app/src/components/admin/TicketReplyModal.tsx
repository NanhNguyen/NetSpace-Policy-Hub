"use client";

import { useEffect, useState, useRef } from "react";
import { X, Send, User, ShieldCheck, RefreshCw } from "lucide-react";
import { Ticket, TicketMessage } from "@/types";
import { TicketService } from "@/lib/services/ticket.service";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TicketReplyModalProps {
    open: boolean;
    onClose: () => void;
    ticket: Ticket | null;
    onRefresh: () => void;
}

export default function TicketReplyModal({ open, onClose, ticket, onRefresh }: TicketReplyModalProps) {
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [localTicket, setLocalTicket] = useState<Ticket | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const fetchDetail = async () => {
        if (!ticket) return;
        try {
            const data = await TicketService.getById(ticket.id);
            setLocalTicket(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (open && ticket) {
            fetchDetail();
        } else {
            setLocalTicket(null);
            setReply("");
        }
    }, [ticket, open]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [localTicket]);

    if (!open || !ticket) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || loading) return;

        setLoading(true);
        try {
            await TicketService.addMessage(ticket.id, {
                content: reply,
                sender_type: 'hr',
                sender_name: 'Phòng Nhân sự'
            });
            setReply("");
            await fetchDetail();
            onRefresh();
        } catch (error) {
            console.error(error);
            alert("Đã có lỗi xảy ra khi gửi câu trả lời.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-soft bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 leading-none">Phòng Hội Thoại HR</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">
                                Nhân viên: <span className="text-slate-700">{ticket.employee_name}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchDetail} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                            <RefreshCw size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-slate-400">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/20">
                    {/* Original Question */}
                    <div className="flex gap-4 max-w-[90%]">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-[10px] shrink-0 border-2 border-white shadow-sm mt-1 uppercase">
                            {ticket.employee_name.substring(0, 2)}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-xs font-black text-slate-700">{ticket.employee_name}</span>
                                <span className="text-[10px] font-bold text-slate-400">{format(new Date(ticket.created_at), "HH:mm dd/MM/yyyy", { locale: vi })}</span>
                            </div>
                            <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-800 font-medium leading-relaxed">
                                {ticket.question}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {localTicket?.messages?.map((msg) => {
                        const isHR = msg.sender_type === 'hr';
                        return (
                            <div key={msg.id} className={`flex gap-4 max-w-[90%] ${isHR ? 'self-end ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[10px] shrink-0 border-2 border-white shadow-sm mt-1 uppercase ${isHR ? 'bg-primary' : 'bg-slate-200 text-slate-600'}`}>
                                    {isHR ? <span className="material-symbols-outlined text-[18px]">support_agent</span> : (msg.sender_name?.substring(0, 2) || 'US')}
                                </div>
                                <div className={`flex flex-col gap-1.5 ${isHR ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 px-1 text-[10px] font-bold text-slate-400">
                                        {!isHR && <span className="text-xs font-black text-slate-700">{msg.sender_name}</span>}
                                        {format(new Date(msg.created_at), "HH:mm dd/MM", { locale: vi })}
                                        {isHR && <span className="text-xs font-black text-slate-700">NetSpace HR</span>}
                                    </div>
                                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${isHR ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-6 border-t border-neutral-soft bg-white shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
                        <textarea
                            required
                            rows={1}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-slate-700 outline-none resize-none"
                            placeholder="Nhập nội dung phản hồi tiếp theo..."
                        />
                        <button
                            type="submit"
                            disabled={loading || !reply.trim()}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${!reply.trim() || loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white shadow-lg  hover:scale-105 active:scale-95'}`}
                        >
                            {loading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-400 font-bold px-4 mt-3 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        Nhân viên sẽ nhận được thông báo ngay khi bạn gửi phản hồi.
                    </p>
                </div>
            </div>
        </div>
    );
}
