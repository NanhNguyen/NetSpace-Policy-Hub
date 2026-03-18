import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PushSubscriptionEntity } from '../tickets/entities/push-subscription.entity';
export declare class PushService implements OnModuleInit {
    private configService;
    private subscriptionRepo;
    constructor(configService: ConfigService, subscriptionRepo: Repository<PushSubscriptionEntity>);
    onModuleInit(): void;
    subscribe(subscription: any, role?: string): Promise<PushSubscriptionEntity | {
        message: string;
    }>;
    notifyHR(title: string, body: string, url?: string): Promise<void>;
}
