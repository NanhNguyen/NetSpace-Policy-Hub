import { Profile, Role, UserRoleType } from "@/types";

// Simulation of a relational DB in memory/localStorage for this session
const ROLES: Role[] = [
    { id: 1, name: "Quản trị viên", code: "ADMIN" },
    { id: 2, name: "Nhân sự", code: "HR" },
    { id: 3, name: "Quản lý yêu cầu", code: "TICKET_MANAGER" },
    { id: 4, name: "Nhân viên", code: "USER" },
];

const INITIAL_USERS: Profile[] = [
    {
        id: "1",
        email: "hr@gmail.com",
        full_name: "HR Manager",
        role_id: 2, // HR Role
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        email: "admin@gmail.com",
        full_name: "System Admin",
        role_id: 1, // ADMIN
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        email: "staff@gmail.com",
        full_name: "Nguyễn Văn A",
        role_id: 4, // USER
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        email: "manager@gmail.com",
        full_name: "Trần Thị B",
        role_id: 3, // TICKET_MANAGER
        created_at: new Date().toISOString(),
    }
];

// Helper to persist/load for demo purposes
const getLocalUsers = (): Profile[] => {
    if (typeof window === 'undefined') return INITIAL_USERS;
    const stored = localStorage.getItem('mock_users_db');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('mock_users_db', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
};

const saveLocalUsers = (users: Profile[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mock_users_db', JSON.stringify(users));
    }
};

export const UserService = {
    async getAllRoles(): Promise<Role[]> {
        return ROLES;
    },

    async getAllProfiles(): Promise<Profile[]> {
        const users = getLocalUsers();
        // Join with roles
        return users.map(user => ({
            ...user,
            role: ROLES.find(r => r.id === user.role_id)
        }));
    },

    async getProfile(userId: string): Promise<Profile | null> {
        const users = getLocalUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        return {
            ...user,
            role: ROLES.find(r => r.id === user.role_id)
        };
    },

    async updateRole(userId: string, roleId: number): Promise<boolean> {
        const users = getLocalUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return false;

        users[index].role_id = roleId;
        saveLocalUsers(users);
        return true;
    },

    async createProfile(data: { email: string; full_name: string; role_id: number; password?: string }): Promise<Profile> {
        const users = getLocalUsers();
        const maxId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) : 0;
        const newId = (maxId + 1).toString();
        
        const newProfile: Profile = {
            id: newId,
            email: data.email,
            full_name: data.full_name,
            role_id: data.role_id,
            created_at: new Date().toISOString(),
        };

        if (data.password) {
            localStorage.setItem(`mock_pass_${data.email}`, data.password);
        }

        users.push(newProfile);
        saveLocalUsers(users);
        return {
            ...newProfile,
            role: ROLES.find(r => r.id === newProfile.role_id)
        };
    },

    async login(email: string, pass: string): Promise<{ profile: Profile; token: string } | null> {
        // Handle core test accounts
        if (pass === "123456" && (email === "hr@gmail.com" || email === "admin@gmail.com" || email === "staff@gmail.com" || email === "manager@gmail.com")) {
            const users = getLocalUsers();
            const user = users.find(u => u.email === email);
            if (user) {
                const profile = await this.getProfile(user.id);
                return profile ? { profile, token: `mock-jwt-token-${user.id}` } : null;
            }
        }

        // Handle dynamically created users
        const savedPass = localStorage.getItem(`mock_pass_${email}`);
        if (savedPass && pass === savedPass) {
            const users = getLocalUsers();
            const user = users.find(u => u.email === email);
            if (user) {
                const profile = await this.getProfile(user.id);
                return profile ? { profile, token: `mock-jwt-token-${user.id}` } : null;
            }
        }

        return null;
    }
};
