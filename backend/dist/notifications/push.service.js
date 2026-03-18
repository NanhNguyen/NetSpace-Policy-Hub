"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const webpush = __importStar(require("web-push"));
const push_subscription_entity_1 = require("../tickets/entities/push-subscription.entity");
let PushService = class PushService {
    configService;
    subscriptionRepo;
    constructor(configService, subscriptionRepo) {
        this.configService = configService;
        this.subscriptionRepo = subscriptionRepo;
    }
    onModuleInit() {
        const publicKey = this.configService.get('VAPID_PUBLIC_KEY');
        const privateKey = this.configService.get('VAPID_PRIVATE_KEY');
        const email = this.configService.get('VAPID_EMAIL');
        if (publicKey && privateKey && email) {
            webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
            console.log('[PUSH] Web Push initialized');
        }
    }
    async subscribe(subscription, role = 'hr') {
        const endpoint = subscription.endpoint;
        const exists = await this.subscriptionRepo.find();
        const alreadySubscribed = exists.some(s => s.subscription.endpoint === endpoint);
        if (!alreadySubscribed) {
            const newSub = this.subscriptionRepo.create({ subscription, role });
            return this.subscriptionRepo.save(newSub);
        }
        return { message: 'Already subscribed' };
    }
    async notifyHR(title, body, url = '/admin/tickets') {
        const subscriptions = await this.subscriptionRepo.find({ where: { role: 'hr' } });
        console.log(`[PUSH] Notifying ${subscriptions.length} HR devices...`);
        const payload = JSON.stringify({
            notification: {
                title,
                body,
                icon: '/icons/icon-192x192.png',
                data: { url }
            }
        });
        const promises = subscriptions.map(sub => webpush.sendNotification(sub.subscription, payload)
            .catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) {
                console.log('[PUSH] Subscription expired, removing...');
                return this.subscriptionRepo.delete(sub.id);
            }
            console.error('[PUSH] Error sending notification', err);
        }));
        await Promise.all(promises);
    }
};
exports.PushService = PushService;
exports.PushService = PushService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(push_subscription_entity_1.PushSubscriptionEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], PushService);
//# sourceMappingURL=push.service.js.map