"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/db/client";
import { TicketService } from "@/lib/services/ticket.service";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { RefreshCw } from "lucide-react";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const router = useRouter();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const loadData = async () => {
        try {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/auth/login?redirect=tickets");
                return;
            }
            setUser(data.user);
            
            if (data.user.email) {
                const userTickets = await TicketService.getByEmail(data.user.email, data.user.id);
                const sorted = userTickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setTickets(sorted);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [router]);

    useEffect(() => {
        if (chatEndRef.current) {
            const container = chatEndRef.current.closest('.overflow-y-auto');
            if (container) {
                container.scrollTo({
                    top: (container as HTMLElement).scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedTicketId, tickets]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'open':
                return { label: 'Đang chờ', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'schedule' };
            case 'answered':
                return { label: 'Đã phản hồi', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'check_circle' };
            case 'closed':
                return { label: 'Đã đóng', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'archive' };
            default:
                return { label: status, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'info' };
        }
    };

    const filteredTickets = useMemo(() => {
        if (statusFilter === 'all') return tickets;
        return tickets.filter(t => t.status === statusFilter);
    }, [tickets, statusFilter]);

    const selectedTicket = useMemo(() => {
        return tickets.find(t => t.id === selectedTicketId) || null;
    }, [tickets, selectedTicketId]);

    const handleSendReply = async () => {
        if (!reply.trim() || !selectedTicket || sending) return;

        setSending(true);
        try {
            await TicketService.addMessage(selectedTicket.id, {
                content: reply,
                sender_type: 'employee',
                sender_id: user.id,
                sender_name: user.user_metadata?.full_name || user.email
            });
            setReply("");
            await loadData(); // Refresh list to get new messages and status
        } catch (error) {
            console.error("Reply error:", error);
            alert("Không thể gửi phản hồi.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
                <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-text-main">Yêu cầu của tôi</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Lịch sử Yêu cầu</h1>
                    <p className="text-slate-500 font-medium font-inter">Xem lại luồng trao đổi và các thắc mắc bạn đã gửi.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {['all', 'open', 'answered', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setSelectedTicketId(null); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                statusFilter === status 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {status === 'all' ? 'Tất cả' : getStatusConfig(status).label}
                        </button>
                    ))}
                    <button
                        onClick={() => document.querySelector<HTMLButtonElement>('header button[aria-label="Hỏi HR"], header button:has(span.material-symbols-outlined:contains("support_agent"))')?.click()}
                        className="ml-2 inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg text-xs"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Tạo mới
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[600px]">
                {/* List Pane */}
                <div className={`w-full lg:w-[35%] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Danh sách yêu cầu</span>
                        <span className="bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black">{filteredTickets.length}</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center p-8">
                                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">inbox</span>
                                <p className="text-sm font-bold text-slate-400">Không tìm thấy yêu cầu nào.</p>
                            </div>
                        ) : (
                            filteredTickets.map(ticket => {
                                const statusConfig = getStatusConfig(ticket.status);
                                const isSelected = selectedTicketId === ticket.id;
                                return (
                                    <div 
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all border group ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h3 className={`text-sm font-black line-clamp-2 leading-snug ${isSelected ? 'text-primary' : 'text-slate-800 group-hover:text-primary transition-colors'}`}>
                                                {ticket.topic || "Không có chủ đề"}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.color.replace('text-', 'bg-')}`}></span>
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${statusConfig.color}`}>{statusConfig.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {ticket.messages && ticket.messages.length > 0 && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                                        <span className="material-symbols-outlined text-[12px]">chat_bubble</span>
                                                        {ticket.messages.length}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {format(new Date(ticket.created_at), "dd/MM", { locale: vi })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Conversation Pane */}
                <div className={`w-full lg:w-[65%] bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden ${!selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedTicketId(null)}
                                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    </button>
                                    <div>
                                        <h2 className="text-sm font-black text-slate-900 tracking-tight">{selectedTicket.topic || "Không có chủ đề"}</h2>
                                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                                            ID: #{selectedTicket.id.split('-')[0].toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${getStatusConfig(selectedTicket.status).bg} ${getStatusConfig(selectedTicket.status).border}`}>
                                    <span className={`material-symbols-outlined text-[14px] ${getStatusConfig(selectedTicket.status).color}`}>
                                        {getStatusConfig(selectedTicket.status).icon}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${getStatusConfig(selectedTicket.status).color}`}>
                                        {getStatusConfig(selectedTicket.status).label}
                                    </span>
                                </div>
                            </div>

                            {/* Conversation Bubbles */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                                {/* First Question (Original) - User Side: Right */}
                                <div className="flex gap-4 max-w-[85%] self-end ml-auto flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-[10px] shrink-0 border-2 border-white shadow-sm mt-1 uppercase">
                                        {selectedTicket.employee_name ? selectedTicket.employee_name.substring(0, 2) : 'US'}
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-end">
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[10px] font-bold text-slate-400">{format(new Date(selectedTicket.created_at), "HH:mm dd/MM/yyyy", { locale: vi })}</span>
                                            <span className="text-xs font-black text-slate-700">{selectedTicket.employee_name}</span>
                                        </div>
                                        <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm text-sm text-slate-800 font-medium leading-relaxed">
                                            {selectedTicket.question}
                                        </div>
                                    </div>
                                </div>

                                {/* Thread Messages */}
                                {selectedTicket.messages?.map((msg, idx) => {
                                    const isHR = msg.sender_type === 'hr';
                                    return (
                                        <div key={idx} className={`flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${!isHR ? 'self-end ml-auto flex-row-reverse' : ''}`}>
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[10px] shrink-0 border-2 border-white shadow-sm mt-1 uppercase ${isHR ? 'bg-primary' : 'bg-slate-200 text-slate-600'}`}>
                                                {isHR ? <span className="material-symbols-outlined text-[18px]">support_agent</span> : (msg.sender_name?.substring(0, 2) || 'US')}
                                            </div>
                                            <div className={`flex flex-col gap-1.5 ${!isHR ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 px-1">
                                                    {isHR && <span className="text-xs font-black text-slate-700 flex items-center gap-1">NetSpace HR <span className="material-symbols-outlined text-[14px] text-primary">verified</span></span>}
                                                    <span className="text-[10px] font-bold text-slate-400">{format(new Date(msg.created_at), "HH:mm dd/MM", { locale: vi })}</span>
                                                    {!isHR && <span className="text-xs font-black text-slate-700">{msg.sender_name}</span>}
                                                </div>
                                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${isHR ? 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-primary text-white rounded-tr-sm'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Legacy Answer (if exists and not in messages) - HR: Left */}
                                {selectedTicket.answer && (!selectedTicket.messages || !selectedTicket.messages.find(m => m.content === selectedTicket.answer)) && (
                                    <div className="flex gap-4 max-w-[85%]">
                                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shrink-0 border-2 border-white shadow-sm mt-1">
                                            <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <div className="flex items-center gap-2 px-1">
                                                <span className="text-xs font-black text-slate-700">NetSpace HR <span className="material-symbols-outlined text-[14px] text-primary">verified</span></span>
                                                <span className="text-[10px] font-bold text-slate-400">{selectedTicket.answered_at ? format(new Date(selectedTicket.answered_at), "HH:mm dd/MM", { locale: vi }) : ''}</span>
                                            </div>
                                            <div className="bg-slate-100 border border-slate-200 text-slate-800 px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm text-sm font-medium leading-relaxed">
                                                {selectedTicket.answer}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={chatEndRef} />
                            </div>

                            {/* Reply Box */}
                            <div className="px-6 py-5 border-t border-slate-100 bg-white shrink-0">
                                {selectedTicket.status === 'closed' ? (
                                    <div className="text-center py-2">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Yêu cầu này đã được đóng</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
                                            <textarea 
                                                rows={1}
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendReply();
                                                    }
                                                }}
                                                placeholder="Nhập nội dung phản hồi của bạn..."
                                                className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 outline-none resize-none" 
                                            />
                                            <button 
                                                onClick={handleSendReply}
                                                disabled={!reply.trim() || sending}
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${!reply.trim() || sending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'}`}
                                            >
                                                {sending ? <RefreshCw size={18} className="animate-spin" /> : <span className="material-symbols-outlined text-[22px] ml-0.5">send</span>}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold px-2">Nhấn Enter để gửi nội dung.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200/50 mb-8 relative">
                                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                                <span className="material-symbols-outlined text-6xl text-slate-200 relative z-10">forum</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">Khu vực hội thoại</h3>
                            <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                Chọn một yêu cầu từ danh sách bên trái để theo dõi luồng trao đổi chi tiết.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="h-4"></div>
        </main>
    );
}
