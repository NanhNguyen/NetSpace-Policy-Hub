import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private pushService: PushService) { }

    @Post('subscribe')
    subscribe(@Body() body: { subscription: any, role?: string }) {
        return this.pushService.subscribe(body.subscription, body.role);
    }

    @Get(':userId/:role')
    getNotifications(@Param('userId') userId: string, @Param('role') role: string) {
        return this.pushService.getNotifications(userId, role);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.pushService.markAsRead(id);
    }

    @Patch('read-all/:userId/:role')
    markAllAsRead(@Param('userId') userId: string, @Param('role') role: string) {
        return this.pushService.markAllAsRead(userId, role);
    }
}
