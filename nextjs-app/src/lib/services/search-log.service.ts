const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SearchLogService = {
    async log(query: string, resultCount: number) {
        if (!query.trim()) return;

        try {
            await fetch(`${API_URL}/search-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query.trim(), resultCount }),
            });
        } catch (error) {
            console.error('Error logging search:', error);
        }
    },

    async getTopQueries() {
        const resp = await fetch(`${API_URL}/search-logs/top`);
        if (!resp.ok) throw new Error('Failed to fetch top queries');
        return resp.json();
    },

    async getStats() {
        const resp = await fetch(`${API_URL}/search-logs/stats`);
        if (!resp.ok) throw new Error('Failed to fetch stats');
        return resp.json();
    },

    async getRecent() {
        const resp = await fetch(`${API_URL}/search-logs/recent`);
        if (!resp.ok) throw new Error('Failed to fetch recent logs');
        return resp.json();
    }
};
