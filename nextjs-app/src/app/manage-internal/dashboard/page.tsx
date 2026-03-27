"use client";

import { useEffect, useState } from 'react';
import {
    FileText,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    Clock,
    User,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';
import { PolicyService } from '@/lib/services/policy.service';
import { FAQService } from '@/lib/services/faq.service';
import { TicketService } from '@/lib/services/ticket.service';
import { SearchLogService } from '@/lib/services/search-log.service';
import Link from 'next/link';
import { Ticket } from '@/types';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
    const [topQueries, setTopQueries] = useState<{ query: string, count: number }[]>([]);
    const [stats, setStats] = useState([
        { name: 'Tổng chính sách', value: '0', icon: FileText, color: 'blue', change: '+0%' },
        { name: 'Tổng câu hỏi FAQ', value: '0', icon: MessageSquare, color: 'orange', change: '+0%' },
        { name: 'Tìm kiếm/Tháng', value: '0', icon: TrendingUp, color: 'green', change: '+0%' },
        { name: 'Queries 0 kết quả', value: '0', icon: AlertCircle, color: 'red', change: '0' },
    ]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [policies, faqs, tickets, searchStats, searchTop] = await Promise.all([
                    PolicyService.getAllAdmin(),
                    FAQService.getAll(),
                    TicketService.getAll(),
                    SearchLogService.getStats().catch(() => ({ total: 0, zeroResults: 0 })),
                    SearchLogService.getTopQueries().catch(() => [])
                ]);

                setRecentTickets(tickets.slice(0, 5));
                setTopQueries(searchTop.slice(0, 5));

                setStats([
                    { name: 'Tổng chính sách', value: (policies?.length || 0).toString(), icon: FileText, color: 'blue', change: 'Live' },
                    { name: 'Tổng câu hỏi FAQ', value: (faqs?.length || 0).toString(), icon: MessageSquare, color: 'orange', change: 'Live' },
                    { name: 'Tổng lượt tìm kiếm', value: (searchStats?.total || 0).toLocaleString(), icon: TrendingUp, color: 'green', change: 'Tất cả' },
                    { name: 'Queries 0 kết quả', value: (searchStats?.zeroResults || 0).toString(), icon: AlertCircle, color: 'red', change: 'Cần chú ý' },
                ]);
            } catch (err) {
                console.error("Dashboard load failed", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-slate-500 font-medium">Theo dõi dữ liệu thực từ hệ thống và yêu cầu của nhân viên.</p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cập nhật lần cuối</p>
                    <p className="text-sm font-bold text-slate-900">{new Date().toLocaleTimeString('vi-VN')}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${
                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-rose-50 text-rose-600'
                            }`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${
                                stat.color === 'red' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                            }`}>{stat.change}</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">{loading ? '...' : stat.value}</div>
                        <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wide">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tickets Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary rounded-full" />
                            <h2 className="font-black text-slate-900 text-lg tracking-tight">Yêu cầu mới nhất</h2>
                        </div>
                        <Link href="/manage-internal/tickets" className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                            Quản lý tất cả
                        </Link>
                    </div>
                    <div className="flex-1">
                        {loading ? (
                            <div className="p-10 space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-xl" />)}
                            </div>
                        ) : recentTickets.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {recentTickets.map(ticket => (
                                    <Link 
                                        key={ticket.id} 
                                        href={`/manage-internal/tickets`}
                                        className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <User size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className="text-sm font-black text-slate-900 truncate">{ticket.question}</p>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate font-medium">{ticket.employee_email}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-2">
                                    <MessageSquare size={32} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-wide">CHƯA CÓ YÊU CẦU NÀO</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analytics Section Preview */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                            <h2 className="font-black text-slate-900 text-lg tracking-tight">Từ khóa tìm kiếm</h2>
                        </div>
                        <Link href="/manage-internal/analytics" className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                            Phân tích dữ liệu
                        </Link>
                    </div>
                    <div className="p-6 flex-1">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-slate-50 animate-pulse rounded-full" />)}
                            </div>
                        ) : topQueries.length > 0 ? (
                            <div className="space-y-4">
                                {topQueries.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-bold text-slate-700">{item.query}</span>
                                                <span className="text-xs font-black text-slate-900 group-hover:text-emerald-500 transition-colors">{item.count} lượt</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all duration-1000" 
                                                    style={{ width: `${(item.count / topQueries[0].count) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-2">
                                    <SearchIcon size={32} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-wide">CHƯA CÓ DỮ LIỆU TÌM KIẾM</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
