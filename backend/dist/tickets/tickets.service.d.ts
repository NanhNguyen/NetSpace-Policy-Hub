import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';
export declare class TicketsService {
    private ticketsRepository;
    private mailService;
    private pushService;
    constructor(ticketsRepository: Repository<Ticket>, mailService: MailService, pushService: PushService);
    create(ticket: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findByEmail(email: string): Promise<Ticket[]>;
    answer(id: string, answer: string): Promise<Ticket>;
}
