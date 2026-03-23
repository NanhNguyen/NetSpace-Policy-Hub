import { Policy, PolicyCategory } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
            const resp = await fetch(`${API_URL}/policies/${id}`);
            if (!resp.ok) throw new Error('Policy not found');
            return resp.json();
        } catch (error) {
            console.error('Fetch by ID failed:', error);
            throw error;
        }
    },

    async getBySlug(slug: string) {
        try {
            const resp = await fetch(`${API_URL}/policies/slug/${slug}`);
            if (!resp.ok) throw new Error('Policy not found');
            return resp.json();
        } catch (error) {
            console.error('Fetch by slug failed:', error);
            throw error;
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
