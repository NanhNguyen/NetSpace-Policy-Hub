import { Controller, Get, Post, Body, Patch, Param, Query, HttpException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Body() ticket: Partial<Ticket>) {
        return this.ticketsService.create(ticket);
    }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get('search')
    findByEmail(@Query('email') email: string, @Query('userId') userId?: string) {
        return this.ticketsService.findByEmail(email, userId);
    }

    @Get('stats/by-topic')
    getStatsByTopic() {
        return this.ticketsService.getStatsByTopic();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id/answer')
    answer(@Param('id') id: string, @Body('answer') answer: string) {
        return this.ticketsService.answer(id, answer);
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id') id: string,
        @Body('content') content: string,
        @Body('sender_type') sender_type: 'employee' | 'hr',
        @Body('sender_id') sender_id?: string,
        @Body('sender_name') sender_name?: string,
    ) {
        try {
            return await this.ticketsService.addMessage(id, content, sender_type, sender_id, sender_name);
        } catch (e: any) {
            console.error('Error adding message:', e);
            throw new HttpException({ error: e.message, stack: e.stack }, 500);
        }
    }

    @Get(':id/similar')
    findSimilar(@Param('id') id: string) {
        return this.ticketsService.findSimilar(id);
    }
}
