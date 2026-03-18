import { FAQ } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const FAQService = {
    async getAll(): Promise<FAQ[]> {
        const resp = await fetch(`${API_URL}/faqs`);
        if (!resp.ok) throw new Error('Failed to fetch FAQs');
        return resp.json();
    },

    async create(faq: Partial<FAQ>): Promise<FAQ> {
        const resp = await fetch(`${API_URL}/faqs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faq),
        });
        if (!resp.ok) throw new Error('Failed to create FAQ');
        return resp.json();
    },

    async update(id: string, updates: Partial<FAQ>): Promise<FAQ> {
        const resp = await fetch(`${API_URL}/faqs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!resp.ok) throw new Error('Failed to update FAQ');
        return resp.json();
    },

    async delete(id: string): Promise<void> {
        const resp = await fetch(`${API_URL}/faqs/${id}`, {
            method: 'DELETE',
        });
        if (!resp.ok) throw new Error('Failed to delete FAQ');
    }
};
