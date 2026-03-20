import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { Profile } from '../users/entities/profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, Profile])],
    controllers: [TicketsController],
    providers: [TicketsService],
})
export class TicketsModule { }
