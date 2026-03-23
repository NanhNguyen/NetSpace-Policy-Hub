import { Ticket } from './ticket.entity';
export declare class TicketMessage {
    id: string;
    ticket_id: string;
    content: string;
    sender_type: 'employee' | 'hr';
    sender_id: string;
    sender_name: string;
    created_at: Date;
    ticket: Ticket;
}
