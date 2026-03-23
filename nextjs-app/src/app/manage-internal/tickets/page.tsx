"use client";

import { useEffect, useState } from 'react';
import { Mail, Clock, MessageSquare, Search, Command, TrendingUp, Info } from 'lucide-react';
import { TicketService } from '@/lib/services/ticket.service';
import { Ticket } from '@/types';
import TicketReplyModal from '@/components/admin/TicketReplyModal';
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const COMPANY_TOPICS = [
    { key: 'all', label: 'Tất cả', color: 'bg-slate-900 text-white' },
    { key: 'Chính sách Nghỉ phép', label: 'Nghỉ phép', color: 'bg-blue-100 text-blue-700' },
    { key: 'Lương & Phúc lợi', label: 'Lương & Phúc lợi', color: 'bg-green-100 text-green-700' },
    { key: 'Làm việc từ xa', label: 'Làm việc từ xa', color: 'bg-indigo-100 text-indigo-700' },
    { key: 'Bảo mật & IT', label: 'Bảo mật & IT', color: 'bg-orange-100 text-orange-700' },
    { key: 'Nội quy Công sở', label: 'Nội quy', color: 'bg-purple-100 text-purple-700' },
    { key: 'Hoàn chi phí', label: 'Hoàn chi phí', color: 'bg-yellow-100 text-yellow-700' },
    { key: 'Khác', label: 'Khác', color: 'bg-slate-100 text-slate-500' },
];

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'open' | 'answered'>('open');
    const [activeTopic, setActiveTopic] = useState<string>('all');
    const [search, setSearch] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const [ticketsData, statsData] = await Promise.all([
                TicketService.getAll(),
                TicketService.getStatsByTopic()
            ]);
            setTickets(ticketsData);
            setStats(statsData);
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

    const filtered = tickets.filter(t => {
        const matchesTab = activeTab === 'all' || t.status === activeTab;
        const matchesTopic = activeTopic === 'all' || t.topic === activeTopic;
        const matchesSearch =
            t.employee_name.toLowerCase().includes(search.toLowerCase()) ||
            t.question.toLowerCase().includes(search.toLowerCase()) ||
            t.employee_email.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesTopic && matchesSearch;
    });

    const pendingCount = tickets.filter(t => t.status === 'open').length;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Hỗ trợ Nhân viên
                    </h1>
                    <p className="text-sm font-bold text-text-muted mt-2 flex items-center gap-2">
                        <Command size={14} className="text-primary" />
                        Quản lý thắc mắc và phản hồi nội bộ tập trung.
                    </p>
                </div>
                
                <div className="bg-white border-2 border-orange-100 px-6 py-4 rounded-3xl flex items-center gap-5 shadow-sm">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] leading-none mb-2">Đang chờ xử lý</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">{pendingCount} <span className="text-xs font-bold text-slate-400">Yêu cầu</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-neutral-soft shadow-sm flex flex-col md:flex-row gap-5 items-center">
                <div className="flex flex-1 flex-wrap gap-5 items-center w-full">
                    <div className="flex flex-col gap-1.5 min-w-[200px] w-full md:w-auto">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lọc trạng thái</label>
                        <select 
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as any)}
                            className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="open">Chờ phản hồi (Mới)</option>
                            <option value="answered">Đang tương tác</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-[200px] w-full md:w-auto">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phân loại chủ đề</label>
                        <select 
                            value={activeTopic}
                            onChange={(e) => setActiveTopic(e.target.value)}
                            className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="all">
                                Tất cả chủ đề {stats.reduce((acc, s) => acc + (parseInt(s.openCount) || 0), 0) > 0 ? `(${stats.reduce((acc, s) => acc + (parseInt(s.openCount) || 0), 0)})` : ''}
                            </option>
                            {COMPANY_TOPICS.filter(t => t.key !== 'all').map(topic => {
                                const stat = stats.find(s => s.topic === topic.key);
                                const openCount = stat ? parseInt(stat.openCount) : 0;
                                return (
                                    <option key={topic.key} value={topic.key}>
                                        {topic.label} {openCount > 0 ? `(${openCount})` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-[300px] w-full">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tìm kiếm nhanh</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Tên, Email hoặc nội dung..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-11 pr-5 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-xs font-black transition-all"
                            />
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={loadTickets}
                    className="w-full md:w-auto h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 mt-4 md:mt-0"
                >
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                    Làm mới
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="py-24 text-center">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-muted font-black text-xs uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-24 text-center text-text-muted bg-white border-2 border-slate-100 rounded-3xl border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-300">search_off</span>
                        </div>
                        <p className="font-bold">Không tìm thấy thắc mắc nào phù hợp.</p>
                    </div>
                ) : filtered.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all flex flex-col md:flex-row md:items-start justify-between gap-8 group ${ticket.status === 'open' ? 'border-orange-50 hover:border-orange-200 shadow-orange-500/5' : 'border-slate-50 hover:border-slate-200'
                            }`}
                    >
                        <div className="space-y-6 flex-1">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${ticket.status === 'open' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                                    <MessageSquare size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-lg text-slate-900 leading-tight">{ticket.employee_name}</span>
                                    <span className="text-[11px] text-text-muted flex items-center gap-1 font-bold mt-1">
                                        <Mail size={12} className="text-primary" /> {ticket.employee_email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-auto lg:ml-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] bg-slate-100 text-slate-600 font-black uppercase tracking-wider border border-slate-200`}>
                                        {ticket.topic || 'Chung'}
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ticket.status === 'open'
                                        ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'
                                        : 'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                        {ticket.status === 'open' ? 'Chờ Phản Hồi' : 'Đã Trả Lời'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative pl-6 py-1 border-l-4 border-slate-100 group-hover:border-primary transition-colors">
                                <p className="text-base text-slate-800 leading-relaxed font-bold">
                                    {ticket.question}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-slate-300" />
                                    {format(new Date(ticket.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                                </span>
                                {ticket.messages && ticket.messages.length > 0 && (
                                    <span className="flex items-center gap-1.5 text-primary">
                                        <MessageSquare size={16} />
                                        {ticket.messages.length} lượt trao đổi
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-3 self-center min-w-[160px]">
                            <button
                                onClick={() => handleAnswerClick(ticket)}
                                className={`w-full whitespace-nowrap px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${ticket.status === 'open'
                                    ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/20 hover:shadow-primary/30'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">forum</span>
                                {ticket.status === 'open' ? 'Trả lời ngay' : 'Tiếp tục phản hồi'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TicketReplyModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticket={selectedTicket}
                onRefresh={loadTickets}
            />
        </div>
    );
}
