import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';
import { Profile } from '../users/entities/profile.entity';
export declare class TicketsService {
    private ticketsRepository;
    private messageRepository;
    private profileRepository;
    private mailService;
    private pushService;
    constructor(ticketsRepository: Repository<Ticket>, messageRepository: Repository<TicketMessage>, profileRepository: Repository<Profile>, mailService: MailService, pushService: PushService);
    create(ticket: Partial<Ticket>): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    findByEmail(email: string, userId?: string): Promise<Ticket[]>;
    answer(id: string, answer: string): Promise<Ticket>;
    addMessage(id: string, content: string, sender_type: 'employee' | 'hr', sender_id?: string, sender_name?: string): Promise<TicketMessage>;
    getStatsByTopic(): Promise<any[]>;
}
