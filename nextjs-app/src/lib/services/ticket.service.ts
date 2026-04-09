import { Ticket, TicketMessage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const TicketService = {
    async getAll(): Promise<Ticket[]> {
        try {
            const resp = await fetch(`${API_URL}/tickets`, { cache: 'no-store' });
            if (!resp.ok) return [];
            return await resp.json();
        } catch (error) {
            console.error('Ticket fetch failed:', error);
            return [];
        }
    },

    async getById(id: string): Promise<Ticket> {
        const resp = await fetch(`${API_URL}/tickets/${id}`, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Failed to fetch ticket');
        return resp.json();
    },

    async create(ticket: Partial<Ticket>): Promise<Ticket> {
        const resp = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket),
        });
        if (!resp.ok) throw new Error('Failed to create ticket');
        return resp.json();
    },

    async answer(id: string, answer: string): Promise<Ticket> {
        const resp = await fetch(`${API_URL}/tickets/${id}/answer`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer }),
        });
        if (!resp.ok) throw new Error('Failed to answer ticket');
        return resp.json();
    },

    async addMessage(id: string, messageData: Partial<TicketMessage>): Promise<TicketMessage> {
        const resp = await fetch(`${API_URL}/tickets/${id}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData),
        });
        if (!resp.ok) throw new Error('Failed to add message');
        return resp.json();
    },

    async getByEmail(email: string, user_id?: string): Promise<Ticket[]> {
        try {
            let url = `${API_URL}/tickets/search?email=${encodeURIComponent(email)}`;
            if (user_id) url += `&userId=${encodeURIComponent(user_id)}`;
            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) return [];
            return await resp.json();
        } catch (error) {
            console.error('Ticket search failed:', error);
            return [];
        }
    },

    async getStatsByTopic(): Promise<any[]> {
        const resp = await fetch(`${API_URL}/tickets/stats/by-topic`, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Failed to fetch stats');
        return resp.json();
    },

    async getSimilar(id: string): Promise<Ticket[]> {
        const resp = await fetch(`${API_URL}/tickets/${id}/similar`, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Failed to fetch similar tickets');
        return resp.json();
    }
};
