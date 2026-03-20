import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';
import { Profile } from '../users/entities/profile.entity';
export declare class TicketsService {
    private ticketsRepository;
    private profileRepository;
    private mailService;
    private pushService;
    constructor(ticketsRepository: Repository<Ticket>, profileRepository: Repository<Profile>, mailService: MailService, pushService: PushService);
    create(ticket: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findByEmail(email: string): Promise<Ticket[]>;
    answer(id: string, answer: string): Promise<Ticket>;
}
