"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Policy } from '@/types';
import { PolicyService } from '@/lib/services/policy.service';
import PolicyModal from '@/components/admin/PolicyModal';

export default function AdminPoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    const loadPolicies = async () => {
        try {
            setLoading(true);
            const data = await PolicyService.getAllAdmin();
            setPolicies(data);
        } catch (error) {
            console.error('Error loading policies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPolicies();
    }, []);

    const handleSave = async (policyData: any) => {
        if (selectedPolicy) {
            const updated = await PolicyService.update(selectedPolicy.id, policyData);
            setPolicies(policies.map(p => p.id === selectedPolicy.id ? updated : p));
        } else {
            const newPolicy = await PolicyService.create(policyData);
            setPolicies([newPolicy, ...policies]);
        }
    };

    const handleEdit = (policy: Policy) => {
        setSelectedPolicy(policy);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedPolicy(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chính sách này?')) return;
        try {
            await PolicyService.delete(id);
            setPolicies(policies.filter(p => p.id !== id));
        } catch (error) {
            alert('Lỗi khi xóa chính sách');
        }
    };

    const togglePublish = async (policy: Policy) => {
        try {
            const updated = await PolicyService.update(policy.id, { published: !policy.published });
            setPolicies(policies.map(p => p.id === policy.id ? updated : p));
        } catch (error) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Quản lý Chính sách</h1>
                    <p className="text-sm text-gray-500">Thêm, sửa, xóa hoặc ẩn các chính sách nội bộ.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Thêm chính sách
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tiêu đề</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Danh mục</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cập nhật</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Đang tải...</td></tr>
                        ) : policies.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Chưa có chính sách nào.</td></tr>
                        ) : (
                            policies.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-sm text-gray-900">{p.title}</div>
                                        <div className="text-[10px] text-gray-400 font-mono uppercase">{p.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(p)}
                                            className="hover:opacity-80 transition-opacity"
                                        >
                                            {p.published ? (
                                                <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                    <span className="w-2 h-2 rounded-full bg-green-500" /> Công khai
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                                                    <span className="w-2 h-2 rounded-full bg-gray-300" /> Nháp
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(p.updated_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors inline-block">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors inline-block">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PolicyModal
                    policy={selectedPolicy}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
