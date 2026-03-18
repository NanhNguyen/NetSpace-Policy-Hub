"use client";

import { useEffect, useState } from 'react';
import { Mail, Clock, MessageSquare, Search, Filter } from 'lucide-react';
import { TicketService } from '@/lib/services/ticket.service';
import { Ticket } from '@/types';
import TicketReplyModal from '@/components/admin/TicketReplyModal';

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'open' | 'answered'>('all');
    const [search, setSearch] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await TicketService.getAll();
            setTickets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleAnswerClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSaveAnswer = async (id: string, answer: string) => {
        await TicketService.answer(id, answer);
        loadTickets();
    };

    const filtered = tickets.filter(t => {
        const matchesTab = activeTab === 'all' || t.status === activeTab;
        const matchesSearch =
            t.employee_name.toLowerCase().includes(search.toLowerCase()) ||
            t.question.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Yêu cầu & Câu hỏi
                    </h1>
                    <p className="text-sm text-text-muted">Phản hồi thắc mắc từ nhân viên trong hệ thống.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-5 rounded-2xl border border-neutral-soft shadow-sm">
                <div className="flex gap-2 flex-wrap">
                    {['all', 'open', 'answered'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black capitalize tracking-tight transition-all ${activeTab === tab
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {tab === 'all' ? 'Tất cả' : tab === 'open' ? 'Chờ xử lý' : 'Đã trả lời'}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-neutral-soft rounded-xl py-2.5 pl-10 pr-4 focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center text-text-muted font-medium">Đang tải danh sách thắc mắc...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-text-muted bg-white border border-neutral-soft rounded-2xl border-dashed">
                        Chưa có yêu cầu nào phù hợp.
                    </div>
                ) : filtered.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 ${ticket.status === 'open' ? 'border-orange-100 hover:border-orange-300' : 'border-neutral-soft hover:border-slate-300'
                            }`}
                    >
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${ticket.status === 'open' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-900">{ticket.employee_name}</span>
                                    <span className="text-xs text-text-muted flex items-center gap-1 font-medium">
                                        <Mail size={12} /> {ticket.employee_email}
                                    </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] bg-slate-100 text-slate-500 font-bold border border-slate-200 capitalize`}>
                                    {ticket.topic || 'Chung'}
                                </span>
                                <span className={`ml-auto sm:ml-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ticket.status === 'open'
                                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                                    : 'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                    {ticket.status === 'open' ? 'Chờ HR' : 'Đã phản hồi'}
                                </span>
                            </div>

                            <div className="relative pl-4 border-l-2 border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                                    {ticket.question}
                                </p>
                            </div>

                            {ticket.answer && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-dotted border-slate-200 mt-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Câu trả lời từ HR</label>
                                    <p className="text-sm text-slate-600 leading-relaxed italic">
                                        {ticket.answer}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-text-muted font-bold">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {new Date(ticket.created_at).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-2 self-end md:self-center">
                            <button
                                onClick={() => handleAnswerClick(ticket)}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-black transition-all shadow-md active:scale-95 ${ticket.status === 'open'
                                    ? 'bg-primary hover:bg-primary-dark text-white border-b-4 border-black/10'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white border-b-4 border-white/10'
                                    }`}
                            >
                                {ticket.status === 'open' ? 'Trả lời ngay' : 'Sửa câu trả lời'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TicketReplyModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={selectedTicket}
                onSave={handleSaveAnswer}
            />
        </div>
    );
}
