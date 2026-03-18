import { Policy } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const PolicyService = {
    async getAllPublished() {
        const resp = await fetch(`${API_URL}/policies?published=true`);
        if (!resp.ok) throw new Error('Failed to fetch policies');
        return resp.json();
    },

    async getAllAdmin() {
        const resp = await fetch(`${API_URL}/policies`);
        if (!resp.ok) throw new Error('Failed to fetch all policies');
        return resp.json();
    },

    async getById(id: string) {
        const resp = await fetch(`${API_URL}/policies/${id}`);
        if (!resp.ok) throw new Error('Policy not found');
        return resp.json();
    },

    async getBySlug(slug: string) {
        const resp = await fetch(`${API_URL}/policies/slug/${slug}`);
        if (!resp.ok) throw new Error('Policy not found');
        return resp.json();
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
