import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(ticket: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findByEmail(email: string, userId?: string): Promise<Ticket[]>;
    getStatsByTopic(): Promise<any[]>;
    findOne(id: string): Promise<Ticket>;
    answer(id: string, answer: string): Promise<Ticket>;
    addMessage(id: string, content: string, sender_type: 'employee' | 'hr', sender_id?: string, sender_name?: string): Promise<import("./entities/ticket-message.entity").TicketMessage>;
    findSimilar(id: string): Promise<Ticket[]>;
}
