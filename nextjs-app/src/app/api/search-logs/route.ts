import { NextResponse } from 'next/server';
import { SearchLogService } from '@/lib/services/search-log.service';

export async function POST(request: Request) {
    try {
        const { query, resultCount } = await request.json();
        await SearchLogService.log(query, resultCount);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to log search' }, { status: 500 });
    }
}
