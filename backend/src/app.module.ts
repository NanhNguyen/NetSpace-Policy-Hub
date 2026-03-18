import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoliciesModule } from './policies/policies.module';
import { TicketsModule } from './tickets/tickets.module';
import { SearchLogsModule } from './search-logs/search-logs.module';
import { FaqsModule } from './faqs/faqs.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Policy } from './policies/entities/policy.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { Faq } from './faqs/entities/faq.entity';
import { SearchLog } from './search-logs/entities/search-log.entity';
import { PushSubscriptionEntity } from './tickets/entities/push-subscription.entity';

// Polyfill for crypto.randomUUID for Node 18
if (!global.crypto) {
  global.crypto = require('crypto');
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Policy, Ticket, Faq, SearchLog, PushSubscriptionEntity],
        synchronize: false,
      }),
    }),
    PoliciesModule,
    TicketsModule,
    SearchLogsModule,
    FaqsModule,
    MailModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
