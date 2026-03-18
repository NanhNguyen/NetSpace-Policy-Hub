import { Ticket } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const TicketService = {
    async getAll(): Promise<Ticket[]> {
        const resp = await fetch(`${API_URL}/tickets`);
        if (!resp.ok) throw new Error('Failed to fetch tickets');
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

    async getByEmail(email: string): Promise<Ticket[]> {
        const resp = await fetch(`${API_URL}/tickets/search?email=${email}`);
        if (!resp.ok) throw new Error('Failed to search tickets');
        return resp.json();
    }
};
