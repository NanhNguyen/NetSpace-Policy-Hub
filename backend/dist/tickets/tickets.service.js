"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_entity_1 = require("./entities/ticket.entity");
const ticket_message_entity_1 = require("./entities/ticket-message.entity");
const mail_service_1 = require("../mail/mail.service");
const push_service_1 = require("../notifications/push.service");
const profile_entity_1 = require("../users/entities/profile.entity");
let TicketsService = class TicketsService {
    ticketsRepository;
    messageRepository;
    profileRepository;
    mailService;
    pushService;
    constructor(ticketsRepository, messageRepository, profileRepository, mailService, pushService) {
        this.ticketsRepository = ticketsRepository;
        this.messageRepository = messageRepository;
        this.profileRepository = profileRepository;
        this.mailService = mailService;
        this.pushService = pushService;
    }
    async create(ticket) {
        const newTicket = this.ticketsRepository.create(ticket);
        const saved = await this.ticketsRepository.save(newTicket);
        this.pushService.notifyHR('Thắc mắc mới từ nhân viên', `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`).catch(err => console.error('Push error:', err));
        this.pushService.createNotification({
            title: 'Thắc mắc mới từ nhân viên',
            message: `${saved.employee_name} vừa đặt một câu hỏi mới: "${saved.question}"`,
            role: 'HR',
            link: '/manage-internal/tickets'
        }).catch(err => console.error('DB Notif error:', err));
        return saved;
    }
    async findAll() {
        return this.ticketsRepository.find({
            relations: ['messages'],
            order: { created_at: 'DESC' }
        });
    }
    async findOne(id) {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['messages']
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async findByEmail(email, userId) {
        const query = this.ticketsRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.messages', 'messages');
        if (userId) {
            query.where('ticket.user_id = :userId', { userId })
                .orWhere('ticket.employee_email = :email', { email });
        }
        else {
            query.where('ticket.employee_email = :email', { email });
        }
        query.orderBy('ticket.created_at', 'DESC')
            .addOrderBy('messages.created_at', 'ASC');
        return query.getMany();
    }
    async answer(id, answer) {
        const ticket = await this.findOne(id);
        ticket.answer = answer;
        ticket.status = 'answered';
        ticket.answered_at = new Date();
        await this.ticketsRepository.save(ticket);
        const message = this.messageRepository.create({
            ticket_id: id,
            content: answer,
            sender_type: 'hr',
            sender_name: 'Phòng Nhân sự'
        });
        await this.messageRepository.save(message);
        await this.mailService.sendTicketAnswer(ticket.employee_email, ticket.employee_name, ticket.question, answer);
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
    async addMessage(id, content, sender_type, sender_id, sender_name) {
        const ticket = await this.findOne(id);
        const message = this.messageRepository.create({
            ticket_id: id,
            content,
            sender_type,
            sender_id,
            sender_name
        });
        const savedMessage = await this.messageRepository.save(message);
        if (sender_type === 'employee') {
            await this.ticketsRepository.update(id, {
                status: 'open'
            });
            this.pushService.notifyHR('Phản hồi mới từ nhân viên', `${sender_name || ticket.employee_name} vừa gửi phản hồi mới cho yêu cầu #${id.split('-')[0]}`).catch(err => console.error('Push error:', err));
            this.pushService.createNotification({
                title: 'Phản hồi mới từ nhân viên',
                message: `${sender_name || ticket.employee_name} vừa gửi phản hồi mới cho yêu cầu: "${ticket.topic || ticket.question.substring(0, 50)}"`,
                role: 'HR',
                link: '/manage-internal/tickets'
            }).catch(err => console.error('DB Notif error:', err));
        }
        else {
            await this.ticketsRepository.update(id, {
                status: 'answered',
                answered_at: new Date()
            });
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_message_entity_1.TicketMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService,
        push_service_1.PushService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map