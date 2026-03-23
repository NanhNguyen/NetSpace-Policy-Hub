import { TicketMessage } from './ticket-message.entity';
export declare class Ticket {
    id: string;
    employee_name: string;
    employee_email: string;
    topic: string;
    user_id: string;
    question: string;
    answer: string;
    status: string;
    created_at: Date;
    answered_at: Date;
    messages: TicketMessage[];
}
