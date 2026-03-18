import { NextResponse } from 'next/server';
import { TicketService } from '@/lib/services/ticket.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const ticket = await TicketService.create({
            employee_name: body.name,
            employee_email: body.email,
            question: body.message,
        });
        return NextResponse.json(ticket);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const tickets = await TicketService.getAll();
        return NextResponse.json(tickets);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}
