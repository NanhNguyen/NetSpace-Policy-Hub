"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Search, UserCheck, Shield, Award, User as UserIcon, RefreshCw, UserPlus } from "lucide-react";
import { UserService } from "@/lib/services/user.service";
import { Profile, Role, UserRoleType } from "@/types";
import UserModal from "@/components/admin/UserModal";

export default function AdminUsersPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pData, rData] = await Promise.all([
                UserService.getAllProfiles(),
                UserService.getAllRoles()
            ]);
            setProfiles(pData);
            setRoles(rData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (userData: { email: string; full_name: string; role_id: number; password?: string }) => {
        try {
            await UserService.createProfile(userData);
            await loadData();
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRoleChange = async (userId: string, newRoleId: string) => {
        setUpdating(userId);
        try {
            const success = await UserService.updateRole(userId, parseInt(newRoleId));
            if (success) {
                // Refresh local state
                const updatedProfiles = await UserService.getAllProfiles();
                setProfiles(updatedProfiles);
            } else {
                alert("Không thể cập nhật quyền hạn.");
            }
        } finally {
            setUpdating(null);
        }
    };

    const filtered = useMemo(() => {
        return profiles.filter(p =>
            p.email.toLowerCase().includes(search.toLowerCase()) ||
            (p.full_name || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [profiles, search]);

    const getRoleBadge = (roleCode: UserRoleType | undefined) => {
        switch (roleCode) {
            case 'ADMIN':
                return <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"><Shield size={12} /> Full Admin</span>;
            case 'HR':
                return <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"><Award size={12} /> HR Manager</span>;
            case 'TICKET_MANAGER':
                return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"><UserCheck size={12} /> Ticket Manager</span>;
            default:
                return <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2"><UserIcon size={12} /> Standard User</span>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Users className="text-primary" />
                        Quản lý Người dùng
                    </h1>
                    <p className="text-sm text-text-muted mt-1 font-medium italic">Phê duyệt và cấp quyền truy cập theo vai trò hệ thống.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-5 py-3 rounded-2xl font-bold text-sm transition-all border border-slate-200 shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        Làm mới
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 border border-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-900/20 active:scale-95 hover:bg-slate-800"
                    >
                        <UserPlus size={18} className="text-primary" />
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            {isCreateModalOpen && (
                <UserModal
                    roles={roles}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={handleCreateUser}
                />
            )}

            {/* Content Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-neutral-soft overflow-hidden">
                <div className="p-8 border-b border-neutral-soft bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo email, họ tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-neutral-soft rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-bold transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-neutral-soft">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nhân viên</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Quyền hiện tại</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Gán vai trò mới</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-soft text-sm">
                            {loading && profiles.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-text-muted font-bold animate-pulse">Đang tải danh sách người dùng...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-text-muted">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={48} className="text-slate-200 mb-2" />
                                            <p className="font-bold text-slate-400">Không tìm thấy người dùng nào phù hợp</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((profile) => (
                                <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-inner uppercase">
                                                {profile.email.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-base">{profile.full_name || 'Chưa cập nhật tên'}</div>
                                                <div className="text-xs text-text-muted font-medium">{profile.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {getRoleBadge(profile.role?.code)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {updating === profile.id ? (
                                            <div className="flex justify-end pr-4"><RefreshCw size={18} className="animate-spin text-primary" /></div>
                                        ) : (
                                            <select
                                                value={profile.role_id}
                                                onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                                                className="bg-white border border-neutral-soft rounded-xl px-4 py-2 text-xs font-black shadow-sm outline-none focus:border-primary transition-all hover:border-slate-300 cursor-pointer"
                                            >
                                                {roles.map(role => (
                                                    <option key={role.id} value={role.id}>{role.name} ({role.code})</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
