import {
    FileText,
    MessageSquare,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

const stats = [
    { name: 'Tổng chính sách', value: '12', icon: FileText, color: 'blue' },
    { name: 'Câu hỏi mới', value: '3', icon: MessageSquare, color: 'orange' },
    { name: 'Tìm kiếm/Tháng', value: '1,240', icon: TrendingUp, color: 'green' },
    { name: 'Queries 0 kết quả', value: '14', icon: AlertCircle, color: 'red' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Tổng quan tình hình hệ thống và câu hỏi từ nhân viên.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tickets Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Câu hỏi gần đây</h2>
                        <button className="text-xs font-bold text-primary hover:underline">Xem tất cả</button>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-10 text-gray-400 text-sm">
                            Chưa có câu hỏi nào mới.
                        </div>
                    </div>
                </div>

                {/* Analytics Section Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Tìm kiếm phổ biến</h2>
                        <button className="text-xs font-bold text-primary hover:underline">Phân tích sâu</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {['Nghỉ phép năm', 'Bảo hiểm XH', 'Thưởng Tết', 'IT Support'].map((query, i) => (
                                <div key={query} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">{i + 1}. {query}</span>
                                    <span className="text-xs font-bold text-gray-400">{150 - i * 20} lượt</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
