import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(ticket: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findByEmail(email: string): Promise<Ticket[]>;
    answer(id: string, answer: string): Promise<Ticket>;
}
