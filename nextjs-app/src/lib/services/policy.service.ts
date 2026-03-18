import { Policy, PolicyCategory } from '@/types';
import { POLICIES } from '../data';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const mapLocalToApi = (p: any): Policy => ({
    id: p.id || '',
    slug: p.id || '',
    title: p.title || '',
    category: (p.cat || 'hr') as PolicyCategory,
    excerpt: p.desc || p.excerpt || '',
    content: p.body || p.content || '',
    icon: p.icon || 'description',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
});

export const PolicyService = {
    async getAllPublished() {
        try {
            const resp = await fetch(`${API_URL}/policies?published=true`);
            const apiData: Policy[] = resp.ok ? await resp.json() : [];

            // Use Map for deduplication based on SLUG
            const policyMap = new Map<string, Policy>();

            // 1. Load local fallback data
            POLICIES.forEach(p => {
                const mapped = mapLocalToApi(p);
                policyMap.set(mapped.slug, mapped);
            });

            // 2. Overwrite with API data (API always wins on slug overlap)
            apiData.forEach(p => {
                policyMap.set(p.slug, p);
            });

            return Array.from(policyMap.values());
        } catch (error) {
            console.warn('API Fetch failed, using local only:', error);
            return POLICIES.map(mapLocalToApi);
        }
    },

    async getAllAdmin() {
        try {
            const resp = await fetch(`${API_URL}/policies`);
            const apiData: Policy[] = resp.ok ? await resp.json() : [];

            const policyMap = new Map<string, Policy>();

            // Load local
            POLICIES.forEach(p => {
                const mapped = mapLocalToApi(p);
                policyMap.set(mapped.slug, mapped);
            });

            // Overwrite with API
            apiData.forEach(p => {
                policyMap.set(p.slug, p);
            });

            return Array.from(policyMap.values());
        } catch (error) {
            console.warn('API Fetch All fail:', error);
            return POLICIES.map(mapLocalToApi);
        }
    },

    async getById(id: string) {
        try {
            const resp = await fetch(`${API_URL}/policies/${id}`);
            if (!resp.ok) throw new Error('Policy not found');
            return resp.json();
        } catch (error) {
            const local = POLICIES.find(p => p.id === id);
            if (local) return mapLocalToApi(local);
            throw error;
        }
    },

    async getBySlug(slug: string) {
        try {
            const resp = await fetch(`${API_URL}/policies/slug/${slug}`);
            if (!resp.ok) throw new Error('Policy not found');
            return resp.json();
        } catch (error) {
            const local = POLICIES.find(p => p.id === slug);
            if (local) return mapLocalToApi(local);
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
