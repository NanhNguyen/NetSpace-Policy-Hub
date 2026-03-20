"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db/client";
import { TicketService } from "@/lib/services/ticket.service";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (!data.user) {
                    router.push("/auth/login?redirect=tickets");
                    return;
                }

                setUser(data.user);
                
                // Ensure email exists before fetching
                if (data.user.email) {
                    const userTickets = await TicketService.getByEmail(data.user.email);
                    // Sort descending by created_at
                    const sorted = userTickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    setTickets(sorted);
                }
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [router]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'open':
                return {
                    label: 'Đang chờ xử lý',
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: 'schedule'
                };
            case 'answered':
                return {
                    label: 'Đã phản hồi',
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    icon: 'check_circle'
                };
            case 'closed':
                return {
                    label: 'Đã đóng',
                    color: 'text-slate-600',
                    bg: 'bg-slate-100',
                    border: 'border-slate-200',
                    icon: 'archive'
                };
            default:
                return {
                    label: status,
                    color: 'text-slate-600',
                    bg: 'bg-slate-100',
                    border: 'border-slate-200',
                    icon: 'info'
                };
        }
    };

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </main>
        );
    }

    if (!user) return null; // Let the redirect handle it

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
                <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-text-main">Yêu cầu của tôi</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Lịch sử Yêu cầu</h1>
                    <p className="text-slate-500">Xem lại các câu hỏi và thắc mắc bạn đã gửi đến HR.</p>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 w-fit">
                    <span className="material-symbols-outlined text-primary text-[24px]">confirmation_number</span>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tổng cộng</p>
                        <p className="text-lg font-black text-slate-800 leading-none">{tickets.length} <span className="text-sm font-semibold text-slate-500">yêu cầu</span></p>
                    </div>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-[32px] text-slate-400">inbox</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Bạn chưa gửi yêu cầu nào</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Bạn có thể hỏi HR các vấn đề về nội quy, chế độ, phúc lợi hay các thắc mắc khác trong quá trình làm việc.</p>
                    <button
                        onClick={() => document.querySelector<HTMLButtonElement>('header button[aria-label="Hỏi HR"], header button:has(span.material-symbols-outlined:contains("support_agent"))')?.click()}
                        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Tạo yêu cầu mới
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tickets.map((ticket) => {
                        const statusConfig = getStatusConfig(ticket.status);
                        
                        return (
                            <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">#{ticket.id.split('-')[0]}</span>
                                            <div className={`px-3 py-1 rounded-full border flex flex-row items-center gap-1.5 text-xs font-bold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                                <span className={`material-symbols-outlined text-[14px] ${statusConfig.color}`}>{statusConfig.icon}</span>
                                                <span className={statusConfig.color}>{statusConfig.label}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 leading-snug">{ticket.topic || "Không có chủ đề"}</h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm w-fit">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        {format(new Date(ticket.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                            Nội dung câu hỏi
                                        </h4>
                                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100/50">{ticket.question}</p>
                                    </div>
                                    
                                    {ticket.status === 'answered' && ticket.answer && (
                                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none"></div>
                                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                                                Phản hồi từ HR
                                            </h4>
                                            <div className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap relative z-10 pl-3.5 border-l-2 border-primary/20">
                                                {ticket.answer}
                                            </div>
                                            {ticket.answered_at && (
                                                <p className="text-[11px] font-bold text-primary/60 mt-3 pt-3 border-t border-primary/10 relative z-10 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    Đã trả lời vào {format(new Date(ticket.answered_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
