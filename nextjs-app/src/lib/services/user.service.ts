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

    async login(email: string, pass: string): Promise<{ profile: Profile; token: string } | null> {
        // Mock login - in a real app this uses JWT on server
        if (email === "hr@gmail.com" && pass === "123456") {
            const profile = await this.getProfile("1");
            return profile ? { profile, token: "mock-jwt-token-hr" } : null;
        }

        // Handle other users if any
        const users = getLocalUsers();
        const user = users.find(u => u.email === email);
        if (user && pass === "123456") { // Universal test pass for demo
            const profile = await this.getProfile(user.id);
            return profile ? { profile, token: `mock-jwt-token-${user.id}` } : null;
        }

        return null;
    }
};
