import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { MailService } from '../mail/mail.service';
import { PushService } from '../notifications/push.service';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        private mailService: MailService,
        private pushService: PushService,
    ) { }

    async create(ticket: Partial<Ticket>): Promise<Ticket> {
        const newTicket = this.ticketsRepository.create(ticket);
        const saved = await this.ticketsRepository.save(newTicket);

        // Notify HR about new ticket
        this.pushService.notifyHR(
            'Thắc mắc mới từ nhân viên',
            `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`
        ).catch(err => console.error('Push error:', err));

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

        return updated;
    }
}
