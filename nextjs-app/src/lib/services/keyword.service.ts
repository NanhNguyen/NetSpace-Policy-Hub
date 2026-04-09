const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export interface Keyword {
    id: string;
    word: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export class KeywordService {
    static async getAllAdmin(): Promise<Keyword[]> {
        const res = await fetch(`${API_URL}/keywords`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch keywords');
        return res.json();
    }

    static async getActive(): Promise<Keyword[]> {
        try {
            const res = await fetch(`${API_URL}/keywords/active`, {
                cache: 'no-store'
            });
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error('Failed to fetch active keywords:', error);
            return [];
        }
    }

    static async create(data: { word: string; order?: number; isActive?: boolean }): Promise<Keyword> {
        const res = await fetch(`${API_URL}/keywords`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create keyword');
        return res.json();
    }

    static async update(id: string, data: { word?: string; order?: number; isActive?: boolean }): Promise<Keyword> {
        const res = await fetch(`${API_URL}/keywords/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update keyword');
        return res.json();
    }

    static async delete(id: string): Promise<void> {
        const res = await fetch(`${API_URL}/keywords/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete keyword');
    }

    static async reorder(orderedIds: string[]): Promise<Keyword[]> {
        const res = await fetch(`${API_URL}/keywords/reorder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds }),
        });
        if (!res.ok) throw new Error('Failed to reorder keywords');
        return res.json();
    }
}
