import { FAQ } from "@/types";
import { FAQS } from "../data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const mapLocalToApi = (f: any, index: number): FAQ => ({
    id: `local-${index}`,
    question: f.q,
    answer: f.a,
    category: f.cat,
    order_index: index + 1,
    published: true
});

export const FAQService = {
    async getAll(): Promise<FAQ[]> {
        try {
            const resp = await fetch(`${API_URL}/faqs`);
            if (!resp.ok) return [];
            const apiData: FAQ[] = await resp.json();
            return apiData.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        } catch (error) {
            console.error('FAQ API failed:', error);
            return [];
        }
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
