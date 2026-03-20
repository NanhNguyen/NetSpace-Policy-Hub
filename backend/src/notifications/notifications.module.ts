import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushService } from './push.service';
import { PushSubscriptionEntity } from '../tickets/entities/push-subscription.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([PushSubscriptionEntity, NotificationEntity])],
    providers: [PushService],
    controllers: [NotificationsController],
    exports: [PushService],
})
export class NotificationsModule { }
