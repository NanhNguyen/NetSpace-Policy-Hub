import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushSubscriptionEntity } from '../tickets/entities/push-subscription.entity';

@Injectable()
export class PushService implements OnModuleInit {
    constructor(
        private configService: ConfigService,
        @InjectRepository(PushSubscriptionEntity)
        private subscriptionRepo: Repository<PushSubscriptionEntity>,
    ) { }

    onModuleInit() {
        const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
        const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
        const email = this.configService.get<string>('VAPID_EMAIL');

        if (publicKey && privateKey && email) {
            webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
            console.log('[PUSH] Web Push initialized');
        }
    }

    async subscribe(subscription: any, role: string = 'hr') {
        // Simple deduplication based on endpoint
        const endpoint = subscription.endpoint;
        const exists = await this.subscriptionRepo.find();
        const alreadySubscribed = exists.some(s => s.subscription.endpoint === endpoint);

        if (!alreadySubscribed) {
            const newSub = this.subscriptionRepo.create({ subscription, role });
            return this.subscriptionRepo.save(newSub);
        }
        return { message: 'Already subscribed' };
    }

    async notifyHR(title: string, body: string, url: string = '/admin/tickets') {
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

        const promises = subscriptions.map(sub =>
            webpush.sendNotification(sub.subscription, payload)
                .catch(err => {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        console.log('[PUSH] Subscription expired, removing...');
                        return this.subscriptionRepo.delete(sub.id);
                    }
                    console.error('[PUSH] Error sending notification', err);
                })
        );

        await Promise.all(promises);
    }
}
