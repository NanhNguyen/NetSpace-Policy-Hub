import { Profile, Role, UserRoleType } from "@/types";
import { supabase } from "@/lib/db/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const UserService = {
    async getAllRoles(): Promise<Role[]> {
        const res = await fetch(`${API_URL}/users/roles`);
        if (!res.ok) return [];
        return await res.json();
    },

    async getAllProfiles(): Promise<Profile[]> {
        const res = await fetch(`${API_URL}/users/profiles`);
        if (!res.ok) return [];
        return await res.json();
    },

    async getProfile(userId: string): Promise<Profile | null> {
        const res = await fetch(`${API_URL}/users/profiles/${userId}`);
        if (!res.ok) return null;
        return await res.json();
    }
,

    async updateRole(userId: string, roleId: number): Promise<boolean> {
        const res = await fetch(`${API_URL}/users/roles/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: roleId }),
        });
        return res.ok;
    },

    async updateProfile(userId: string, data: { email: string; full_name: string; role_id: number }): Promise<boolean> {
        const res = await fetch(`${API_URL}/users/profiles/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.ok;
    },

    async updatePassword(userId: string, password: string): Promise<boolean> {
        const res = await fetch(`${API_URL}/users/profiles/${userId}/password`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return res.ok;
    },

    async createProfile(data: { email: string; full_name: string; role_id: number; password?: string }): Promise<Profile> {
        const res = await fetch(`${API_URL}/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Không thể tạo tài khoản trên hệ thống");
        }
        
        return await res.json();
    },

    async login(email: string, pass: string): Promise<{ profile: Profile; token: string } | null> {
        // --- Authenticate with Supabase Auth (Real DB) ---
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error) {
            throw new Error("Email hoặc mật khẩu không chính xác.");
        }

        if (!data.user) {
            throw new Error("Không thể xác thực người dùng.");
        }

        // Get profile and role from our DB via Backend API
        const profile = await this.getProfile(data.user.id);
        
        if (!profile) {
            // Log out if profile is missing to keep UI consistent
            await supabase.auth.signOut();
            throw new Error(`Đăng nhập thành công nhưng tài khoản của bạn chưa được cấp quyền truy cập (Thiếu Profile cho ID: ${data.user.id}). Vui lòng tạo bản ghi trong bảng 'profiles' trước.`);
        }

        return {
            profile,
            token: data.session?.access_token || "auth-token"
        };
    }
};
