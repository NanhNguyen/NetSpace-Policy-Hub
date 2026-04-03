import { Policy, PolicyCategory } from '@/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const PolicyService = {
    async getAllPublished() {
        try {
            const resp = await fetch(`${API_URL}/policies?published=true`);
            if (!resp.ok) return [];
            return await resp.json();
        } catch (error) {
            console.error('API Fetch failed:', error);
            return [];
        }
    },

    async getAllAdmin() {
        try {
            const resp = await fetch(`${API_URL}/policies`);
            if (!resp.ok) return [];
            return await resp.json();
        } catch (error) {
            console.error('API Fetch All fail:', error);
            return [];
        }
    },

    async getById(id: string) {
        try {
            // If ID is not a UUID, it might be a slug from fallback data
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id) && id.includes('-')) {
                return PolicyService.getBySlug(id).catch(() => null);
            }

            const resp = await fetch(`${API_URL}/policies/${id}`);
            if (!resp.ok) {
                // If ID didn't work, maybe it was meant as a slug
                if (resp.status === 404) {
                    return PolicyService.getBySlug(id).catch(() => null);
                }
                return null;
            }
            return resp.json();
        } catch (error) {
            console.error('Fetch by ID failed, trying slug fallback:', error);
            // Fallback to slug just in case
            return PolicyService.getBySlug(id).catch(() => null);
        }
    },

    async getBySlug(slug: string) {
        try {
            const resp = await fetch(`${API_URL}/policies/slug/${slug}`);
            if (!resp.ok) return null;
            return resp.json();
        } catch (error) {
            console.error('Fetch by slug failed:', error);
            return null;
        }
    },

    async create(policy: Omit<Policy, 'id' | 'created_at' | 'updated_at'>) {
        const resp = await fetch(`${API_URL}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policy),
        });
        if (!resp.ok) throw new Error('Failed to create policy');
        return resp.json();
    },

    async update(id: string, updates: Partial<Policy>) {
        const resp = await fetch(`${API_URL}/policies/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!resp.ok) throw new Error('Failed to update policy');
        return resp.json();
    },

    async delete(id: string) {
        const resp = await fetch(`${API_URL}/policies/${id}`, {
            method: 'DELETE',
        });
        if (!resp.ok) throw new Error('Failed to delete policy');
        return true;
    }
};
