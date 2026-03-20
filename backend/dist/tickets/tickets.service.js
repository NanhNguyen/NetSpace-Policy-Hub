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
const mail_service_1 = require("../mail/mail.service");
const push_service_1 = require("../notifications/push.service");
const profile_entity_1 = require("../users/entities/profile.entity");
let TicketsService = class TicketsService {
    ticketsRepository;
    profileRepository;
    mailService;
    pushService;
    constructor(ticketsRepository, profileRepository, mailService, pushService) {
        this.ticketsRepository = ticketsRepository;
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
        return this.ticketsRepository.find({ order: { created_at: 'DESC' } });
    }
    async findByEmail(email) {
        return this.ticketsRepository.find({
            where: { employee_email: email },
            order: { created_at: 'DESC' }
        });
    }
    async answer(id, answer) {
        const ticket = await this.ticketsRepository.findOne({ where: { id } });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        ticket.answer = answer;
        ticket.status = 'answered';
        ticket.answered_at = new Date();
        const updated = await this.ticketsRepository.save(ticket);
        await this.mailService.sendTicketAnswer(updated.employee_email, updated.employee_name, updated.question, updated.answer);
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService,
        push_service_1.PushService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map