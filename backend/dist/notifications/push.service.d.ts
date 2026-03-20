import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PushSubscriptionEntity } from '../tickets/entities/push-subscription.entity';
import { NotificationEntity } from './entities/notification.entity';
export declare class PushService implements OnModuleInit {
    private configService;
    private subscriptionRepo;
    private notificationRepo;
    constructor(configService: ConfigService, subscriptionRepo: Repository<PushSubscriptionEntity>, notificationRepo: Repository<NotificationEntity>);
    onModuleInit(): void;
    subscribe(subscription: any, role?: string): Promise<PushSubscriptionEntity | {
        message: string;
    }>;
    notifyHR(title: string, body: string, url?: string): Promise<void>;
    createNotification(data: {
        title: string;
        message: string;
        role?: string;
        user_id?: string;
        link?: string;
    }): Promise<NotificationEntity>;
    getNotifications(userId: string, role: string): Promise<NotificationEntity[]>;
    markAsRead(id: string): Promise<void>;
}
