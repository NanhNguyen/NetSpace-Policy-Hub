"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const policies_module_1 = require("./policies/policies.module");
const tickets_module_1 = require("./tickets/tickets.module");
const search_logs_module_1 = require("./search-logs/search-logs.module");
const faqs_module_1 = require("./faqs/faqs.module");
const mail_module_1 = require("./mail/mail.module");
const notifications_module_1 = require("./notifications/notifications.module");
const policy_entity_1 = require("./policies/entities/policy.entity");
const ticket_entity_1 = require("./tickets/entities/ticket.entity");
const faq_entity_1 = require("./faqs/entities/faq.entity");
const search_log_entity_1 = require("./search-logs/entities/search-log.entity");
const push_subscription_entity_1 = require("./tickets/entities/push-subscription.entity");
if (!global.crypto) {
    global.crypto = require('crypto');
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    entities: [policy_entity_1.Policy, ticket_entity_1.Ticket, faq_entity_1.Faq, search_log_entity_1.SearchLog, push_subscription_entity_1.PushSubscriptionEntity],
                    synchronize: false,
                }),
            }),
            policies_module_1.PoliciesModule,
            tickets_module_1.TicketsModule,
            search_logs_module_1.SearchLogsModule,
            faqs_module_1.FaqsModule,
            mail_module_1.MailModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map