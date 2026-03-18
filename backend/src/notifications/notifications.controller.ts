import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private pushService: PushService) { }

    @Post('subscribe')
    subscribe(@Body() body: { subscription: any, role?: string }) {
        return this.pushService.subscribe(body.subscription, body.role);
    }
}
