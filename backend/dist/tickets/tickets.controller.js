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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    create(ticket) {
        return this.ticketsService.create(ticket);
    }
    findAll() {
        return this.ticketsService.findAll();
    }
    findByEmail(email, userId) {
        return this.ticketsService.findByEmail(email, userId);
    }
    getStatsByTopic() {
        return this.ticketsService.getStatsByTopic();
    }
    findOne(id) {
        return this.ticketsService.findOne(id);
    }
    answer(id, answer) {
        return this.ticketsService.answer(id, answer);
    }
    async addMessage(id, content, sender_type, sender_id, sender_name) {
        try {
            return await this.ticketsService.addMessage(id, content, sender_type, sender_id, sender_name);
        }
        catch (e) {
            console.error('Error adding message:', e);
            throw new common_1.HttpException({ error: e.message, stack: e.stack }, 500);
        }
    }
    findSimilar(id) {
        return this.ticketsService.findSimilar(id);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('stats/by-topic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getStatsByTopic", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/answer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('answer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "answer", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Body)('sender_type')),
    __param(3, (0, common_1.Body)('sender_id')),
    __param(4, (0, common_1.Body)('sender_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Get)(':id/similar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findSimilar", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map