"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Search, UserCheck, Shield, Award, User as UserIcon, RefreshCw, UserPlus } from "lucide-react";
import { UserService } from "@/lib/services/user.service";
import { Profile, Role, UserRoleType } from "@/types";
import UserModal from "@/components/admin/UserModal";
import AdminResetPasswordModal from "@/components/admin/AdminResetPasswordModal";

export default function AdminUsersPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [resetPwdUser, setResetPwdUser] = useState<{ id: string; email: string; full_name: string } | null>(null);

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

    const handleSaveUser = async (userData: { email: string; full_name: string; role_id: number; password?: string }) => {
        try {
            if (editingProfile) {
                await UserService.updateProfile(editingProfile.id, {
                    email: userData.email,
                    full_name: userData.full_name,
                    role_id: userData.role_id
                });
                if (userData.password) {
                    await UserService.updatePassword(editingProfile.id, userData.password);
                }
            } else {
                await UserService.createProfile(userData);
            }
            await loadData();
            setEditingProfile(null);
        } catch (error: any) {
            throw error;
        }
    };

    const handleResetPassword = (profile: Profile) => {
        setResetPwdUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || ''
        });
    };

    const handleQuickRoleChange = async (userId: string, newRoleId: string) => {
        setUpdating(userId);
        try {
            const success = await UserService.updateRole(userId, parseInt(newRoleId));
            if (success) {
                await loadData();
            } else {
                alert("Không thể cập nhật quyền hạn.");
            }
        } finally {
            setUpdating(null);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = useMemo(() => {
        return profiles.filter(p =>
            p.email.toLowerCase().includes(search.toLowerCase()) ||
            (p.full_name || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [profiles, search]);

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
                        onClick={() => { setEditingProfile(null); setIsCreateModalOpen(true); }}
                        className="flex items-center gap-2 bg-slate-900 border border-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-slate-900/20 active:scale-95 hover:bg-slate-800"
                    >
                        <UserPlus size={18} className="text-primary" />
                        Cấp Tài Khoản
                    </button>
                </div>
            </div>

            {(isCreateModalOpen || editingProfile) && (
                <UserModal
                    roles={roles}
                    initialData={editingProfile ? {
                        id: editingProfile.id,
                        email: editingProfile.email,
                        full_name: editingProfile.full_name || '',
                        role_id: editingProfile.role_id
                    } : undefined}
                    onClose={() => { setIsCreateModalOpen(false); setEditingProfile(null); }}
                    onSave={handleSaveUser}
                />
            )}

            <AdminResetPasswordModal
                open={!!resetPwdUser}
                onClose={() => setResetPwdUser(null)}
                user={resetPwdUser}
            />

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
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Quyền (Đổi nhanh)</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Thao tác</th>
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
                                        <div className="relative w-max">
                                            {updating === profile.id ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5"><RefreshCw size={14} className="animate-spin text-primary" /><span className="text-[10px] font-bold">Cập nhật...</span></div>
                                            ) : (
                                                <select
                                                    value={profile.role_id}
                                                    onChange={(e) => handleQuickRoleChange(profile.id, e.target.value)}
                                                    className={`appearance-none bg-slate-50 border border-neutral-soft rounded-xl px-4 py-2 pr-10 text-xs font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer ${profile.role?.code === 'ADMIN' ? 'text-slate-900 border-slate-900' :
                                                            profile.role?.code === 'HR' ? 'text-indigo-600 border-indigo-200 bg-indigo-50/30' :
                                                                profile.role?.code === 'TICKET_MANAGER' ? 'text-emerald-600 border-emerald-200 bg-emerald-50/30' :
                                                                    'text-slate-500'
                                                        }`}
                                                >
                                                    {roles.map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {updating !== profile.id && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleResetPassword(profile)}
                                                className="bg-white border border-neutral-soft rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm outline-none hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 text-text-muted hover:text-primary"
                                                title="Đổi mật khẩu"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">key</span>
                                                Đổi MK
                                            </button>
                                            <button
                                                onClick={() => setEditingProfile(profile)}
                                                className="bg-white border border-neutral-soft rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm outline-none hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 text-text-muted hover:text-primary"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                Sửa
                                            </button>
                                        </div>
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
