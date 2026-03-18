"use client";

import { useEffect, useState } from "react";
import {
    BarChart2,
    TrendingUp,
    Search,
    AlertCircle,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    SearchX
} from "lucide-react";
import { SearchLogService } from "@/lib/services/search-log.service";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [topQueries, setTopQueries] = useState<any[]>([]);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [s, t, r] = await Promise.all([
                    SearchLogService.getStats(),
                    SearchLogService.getTopQueries(),
                    SearchLogService.getRecent()
                ]);
                setStats(s);
                setTopQueries(t);
                setRecentLogs(r);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="py-20 text-center text-text-muted">Đang phân tích dữ liệu...</div>;

    const cards = [
        { name: 'Tổng lượt tìm kiếm', value: stats?.total || 0, icon: Search, color: 'blue', trend: '+12%', up: true },
        { name: 'Trong 30 ngày qua', value: stats?.last30Days || 0, icon: Calendar, color: 'green', trend: '+5%', up: true },
        { name: 'Tìm kiếm không có kết quả', value: stats?.zeroResults || 0, icon: SearchX, color: 'red', trend: '-2%', up: false },
        { name: 'Tỷ lệ chuyển đổi', value: '68%', icon: TrendingUp, color: 'purple', trend: '+8%', up: true },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <BarChart2 className="text-primary" />
                    Phân tích & Thống kê
                </h1>
                <p className="text-sm text-text-muted">Theo dõi hành vi tìm kiếm và nhu cầu của nhân viên.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-soft flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-slate-50 text-slate-900 border border-neutral-soft`}>
                                <card.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {card.trend}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 mb-1">{card.value}</div>
                            <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{card.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Queries Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-soft overflow-hidden">
                    <div className="p-6 border-b border-neutral-soft flex items-center justify-between bg-slate-50">
                        <h2 className="font-black text-slate-900 text-sm uppercase tracking-widest">Từ khóa tìm kiếm phổ biến</h2>
                        <span className="text-xs font-bold text-text-muted">Top 10</span>
                    </div>
                    <div className="p-2">
                        {topQueries.length === 0 ? (
                            <div className="py-12 text-center text-text-muted text-sm">Chưa có dữ liệu tìm kiếm.</div>
                        ) : (
                            <div className="divide-y divide-neutral-soft">
                                {topQueries.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-xl font-medium">
                                        <div className="flex items-center gap-4">
                                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm text-slate-700">{item.query}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                            {item.count} lượt
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Searches */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-soft overflow-hidden">
                    <div className="p-6 border-b border-neutral-soft flex items-center justify-between bg-slate-50">
                        <h2 className="font-black text-slate-900 text-sm uppercase tracking-widest">Lịch sử tìm kiếm gần đây</h2>
                        <span className="text-xs font-bold text-text-muted">20 lượt mới nhất</span>
                    </div>
                    <div className="overflow-x-auto">
                        {recentLogs.length === 0 ? (
                            <div className="py-12 text-center text-text-muted text-sm">Chưa có lịch sử.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-xs font-bold text-text-muted uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Thời gian</th>
                                        <th className="px-6 py-4">Từ khóa</th>
                                        <th className="px-6 py-4">Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-soft text-sm">
                                    {recentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs text-text-muted font-medium">
                                                {new Date(log.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                <span className="block opacity-60">
                                                    {new Date(log.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{log.query}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded font-bold text-[10px] ${log.result_count > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {log.result_count} kết quả
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
