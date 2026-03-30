"use client";

import { useEffect, useState, useRef } from "react";
import { X, Send, User, ShieldCheck, RefreshCw, BookmarkPlus, AlertTriangle, MessageSquareQuote } from "lucide-react";
import { Ticket, TicketMessage } from "@/types";
import { TicketService } from "@/lib/services/ticket.service";
import { FAQService } from "@/lib/services/faq.service";
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
    
    // FAQ Promote states
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [faqData, setFaqData] = useState({ question: "", answer: "", category: "hr" });
    const [faqLoading, setFaqLoading] = useState(false);
    
    // Similarity states
    const [similarTickets, setSimilarTickets] = useState<Ticket[]>([]);

    const fetchDetail = async () => {
        if (!ticket) return;
        try {
            const data = await TicketService.getById(ticket.id);
            setLocalTicket(data);
            
            // Fetch similar ones
            const similar = await TicketService.getSimilar(ticket.id);
            setSimilarTickets(similar);
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
            setShowFaqModal(false);
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

    const handleOpenFaq = () => {
        const q = localTicket?.question || "";
        const hrMsgs = localTicket?.messages?.filter(m => m.sender_type === 'hr') || [];
        const a = hrMsgs.length > 0 ? hrMsgs[hrMsgs.length - 1].content : "Liên hệ phòng NS để biết thêm chi tiết.";
        setFaqData({ question: q, answer: a, category: "hr" });
        setShowFaqModal(true);
    };

    const handleCreateFaq = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!faqData.question.trim() || !faqData.answer.trim() || faqLoading) return;
        setFaqLoading(true);
        try {
            await FAQService.create(faqData);
            alert("Đã thêm vào dữ liệu FAQ thành công!");
            setShowFaqModal(false);
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi tạo FAQ mới.");
        } finally {
            setFaqLoading(false);
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
                        {localTicket?.messages?.some((m) => m.sender_type === "hr") && (
                            <button onClick={handleOpenFaq} title="Đưa câu hỏi lên FAQ" className="px-3 py-1.5 flex items-center gap-2 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 rounded-xl transition-colors font-bold text-xs">
                                <BookmarkPlus size={16} />
                                <span className="hidden sm:inline">Lưu FAQ</span>
                            </button>
                        )}
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
                    {/* Hot Topic Alert */}
                    {similarTickets.length >= 2 && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-5 rounded-3xl shadow-sm mb-2 flex gap-4 items-start animate-in slide-in-from-top-4 duration-500">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black text-amber-900 tracking-tight uppercase">Phát hiện chủ đề lặp lại (Chạm mốc 3+)</h4>
                                    <span className="bg-amber-200/50 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Gợi ý FAQ</span>
                                </div>
                                <p className="text-xs text-amber-700/80 font-bold mt-1 leading-relaxed">
                                    Đã có <span className="text-amber-900">{similarTickets.length + 1} nhân viên</span> hỏi về vấn đề tương tự. Bạn nên cân nhắc tổng kết câu trả lời và đưa lên Cẩm nang FAQ.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button 
                                        onClick={handleOpenFaq}
                                        className="text-[10px] font-black bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
                                    >
                                        <BookmarkPlus size={14} /> TIẾN HÀNH TẠO FAQ NGAY
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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

            {/* Inner FAQ Prompt Modal */}
            {showFaqModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                                    <BookmarkPlus size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">Thêm vào Cẩm nang FAQ</h3>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Biên tập lại câu hỏi và ghi nhận đáp án chung</p>
                                </div>
                            </div>
                            <button onClick={() => setShowFaqModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateFaq} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Câu hỏi chung (Đã chắt lọc)</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none leading-relaxed"
                                    rows={2}
                                    value={faqData.question}
                                    onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Câu trả lời (Chính thức)</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none leading-relaxed"
                                    rows={4}
                                    value={faqData.answer}
                                    onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowFaqModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/60">
                                    Hủy bỏ
                                </button>
                                <button type="submit" disabled={faqLoading} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-2">
                                    {faqLoading ? <RefreshCw size={16} className="animate-spin" /> : <BookmarkPlus size={16} />}
                                    Lên Sóng FAQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
