import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';
import { Profile } from '../users/entities/profile.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private mailService: MailService,
        private pushService: PushService,
    ) { }

    async create(ticket: Partial<Ticket>): Promise<Ticket> {
        const newTicket = this.ticketsRepository.create(ticket);
        const saved = await this.ticketsRepository.save(newTicket);

        // Notify HR via WebPush (if still requested)
        this.pushService.notifyHR(
            'Thắc mắc mới từ nhân viên',
            `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`
        ).catch(err => console.error('Push error:', err));

        // Create In-App Notification for HR
        this.pushService.createNotification({
            title: 'Thắc mắc mới từ nhân viên',
            message: `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`,
            role: 'HR',
            link: '/manage-internal/tickets'
        }).catch(err => console.error('DB Notif error:', err));

        return saved;
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketsRepository.find({ order: { created_at: 'DESC' } });
    }

    async findByEmail(email: string): Promise<Ticket[]> {
        return this.ticketsRepository.find({
            where: { employee_email: email },
            order: { created_at: 'DESC' }
        });
    }

    async answer(id: string, answer: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({ where: { id } });
        if (!ticket) throw new NotFoundException('Ticket not found');

        ticket.answer = answer;
        ticket.status = 'answered';
        ticket.answered_at = new Date();

        const updated = await this.ticketsRepository.save(ticket);

        // Send email notification
        await this.mailService.sendTicketAnswer(
            updated.employee_email,
            updated.employee_name,
            updated.question,
            updated.answer
        );

        // Find user by email and send in-app notification
        const profile = await this.profileRepository.findOne({ where: { email: updated.employee_email } });
        if (profile) {
            this.pushService.createNotification({
                title: 'Câu hỏi của bạn đã được trả lời',
                message: `Phòng Nhân sự đã trả lời thắc mắc của bạn về: "${updated.question}"`,
                user_id: profile.id,
                link: '/tickets'
            }).catch(err => console.error('DB Notif error:', err));
        }

        return updated;
    }
}
