import { PushService } from './push.service';
export declare class NotificationsController {
    private pushService;
    constructor(pushService: PushService);
    subscribe(body: {
        subscription: any;
        role?: string;
    }): Promise<import("../tickets/entities/push-subscription.entity").PushSubscriptionEntity | {
        message: string;
    }>;
}
