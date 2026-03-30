import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketMessage } from './entities/ticket-message.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';
import { Profile } from '../users/entities/profile.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        @InjectRepository(TicketMessage)
        private messageRepository: Repository<TicketMessage>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private mailService: MailService,
        private pushService: PushService,
    ) { }

    async create(ticket: Partial<Ticket>): Promise<Ticket> {
        const newTicket = this.ticketsRepository.create(ticket);
        const saved = await this.ticketsRepository.save(newTicket);

        // Notify HR
        this.pushService.notifyHR(
            'Thắc mắc mới từ nhân viên',
            `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`
        ).catch(err => console.error('Push error:', err));

        this.pushService.createNotification({
            title: 'Thắc mắc mới từ nhân viên',
            message: `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`,
            role: 'HR',
            link: '/manage-internal/tickets'
        }).catch(err => console.error('DB Notif error:', err));

        return saved;
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketsRepository.find({ 
            relations: ['messages'],
            order: { created_at: 'DESC' } 
        });
    }

    async findOne(id: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({ 
            where: { id },
            relations: ['messages']
        });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async findByEmail(email: string, userId?: string): Promise<Ticket[]> {
        const query = this.ticketsRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.messages', 'messages');

        if (userId) {
            query.where('ticket.user_id = :userId', { userId })
                 .orWhere('ticket.employee_email = :email', { email });
        } else {
            query.where('ticket.employee_email = :email', { email });
        }
        
        query.orderBy('ticket.created_at', 'DESC')
             .addOrderBy('messages.created_at', 'ASC');

        return query.getMany();
    }

    async answer(id: string, answer: string): Promise<Ticket> {
        const ticket = await this.findOne(id);
        
        ticket.answer = answer; // Keep for compatibility with old UI if needed
        ticket.status = 'answered';
        ticket.answered_at = new Date();
        await this.ticketsRepository.save(ticket);

        // Add to messages thread
        const message = this.messageRepository.create({
            ticket_id: id,
            content: answer,
            sender_type: 'hr',
            sender_name: 'Phòng Nhân sự'
        });
        await this.messageRepository.save(message);

        // Notify Employee
        await this.mailService.sendTicketAnswer(
            ticket.employee_email,
            ticket.employee_name,
            ticket.question,
            answer
        );

        const profile = await this.profileRepository.findOne({ where: { email: ticket.employee_email } });
        const targetUserId = ticket.user_id || profile?.id;
        
        if (targetUserId) {
            this.pushService.createNotification({
                title: 'Câu hỏi của bạn đã được trả lời',
                message: `Phòng Nhân sự đã phản hồi thắc mắc của bạn`,
                user_id: targetUserId,
                link: '/tickets'
            }).catch(err => console.error('DB Notif error:', err));
        }

        return this.findOne(id);
    }

    async addMessage(id: string, content: string, sender_type: 'employee' | 'hr', sender_id?: string, sender_name?: string): Promise<TicketMessage> {
        const ticket = await this.findOne(id);
        
        const message = this.messageRepository.create({
            ticket_id: id,
            content,
            sender_type,
            sender_id,
            sender_name
        });
        const savedMessage = await this.messageRepository.save(message);

        // Update ticket status
        if (sender_type === 'employee') {
            await this.ticketsRepository.update(id, {
                status: 'open'
            });
            
            // Notify HR via Push
            this.pushService.notifyHR(
                'Phản hồi mới từ nhân viên',
                `${sender_name || ticket.employee_name} vừa gửi phản hồi mới cho yêu cầu #${id.split('-')[0]}`
            ).catch(err => console.error('Push error:', err));
            
            // Notify HR via In-App DB
            this.pushService.createNotification({
                title: 'Phản hồi mới từ nhân viên',
                message: `${sender_name || ticket.employee_name} vừa gửi phản hồi mới cho yêu cầu: "${ticket.topic || ticket.question.substring(0, 50)}"`,
                role: 'HR',
                link: '/manage-internal/tickets'
            }).catch(err => console.error('DB Notif error:', err));
            
        } else {
            await this.ticketsRepository.update(id, {
                status: 'answered',
                answered_at: new Date()
            });
            
            // Notify Employee
            const profile = await this.profileRepository.findOne({ where: { email: ticket.employee_email } });
            const targetUserId = ticket.user_id || profile?.id;
            if (targetUserId) {
                this.pushService.createNotification({
                    title: 'Phản hồi mới từ HR',
                    message: `HR đã gửi phản hồi cho yêu cầu: "${ticket.topic || ticket.question.substring(0, 50)}"`,
                    user_id: targetUserId,
                    link: '/tickets'
                }).catch(err => console.error('DB Notif error:', err));
            }
        }

        return savedMessage;
    }

    async getStatsByTopic() {
        return this.ticketsRepository
            .createQueryBuilder('ticket')
            .select('ticket.topic', 'topic')
            .addSelect('COUNT(ticket.id)', 'count')
            .addSelect('COUNT(CASE WHEN ticket.status = \'open\' THEN 1 END)', 'openCount')
            .groupBy('ticket.topic')
            .orderBy('count', 'DESC')
            .getRawMany();
    }

    async findSimilar(id: string): Promise<Ticket[]> {
        const ticket = await this.findOne(id);
        
        // Extract meaningful words (Vietnamese usually has words of 2-7 chars)
        // We filter out common short words and very common ones
        const words = ticket.question
            .toLowerCase()
            .replace(/[.,/?!;:"']/g, ' ')
            .split(/\s+/)
            .filter(w => w.length >= 3 && !['là', 'của', 'cho', 'này', 'trong', 'với'].includes(w));
        
        if (words.length === 0) return [];

        // Build a query counts how many keywords match
        const query = this.ticketsRepository.createQueryBuilder('ticket')
            .where('ticket.id != :id', { id });
        
        // Using OR with ILIKE is simple and effective for this scale
        // For better results, we could count occurrences, but Nest/TypeORM ILIKE is standard
        const conditions = words.map((word, i) => {
            const param = `word${i}`;
            return { sql: `ticket.question ILIKE :${param}`, paramName: param, value: `%${word}%` };
        });

        // We want tickets that match AT LEAST 2 keywords if possible, 
        // but for now let's just find any match and return them.
        // If there are many, we could sort by relevance.
        
        query.andWhere(`(${conditions.map(c => c.sql).join(' OR ')})`, 
            conditions.reduce((acc, c) => ({ ...acc, [c.paramName]: c.value }), {})
        );

        return query.take(10).getMany();
    }
}
