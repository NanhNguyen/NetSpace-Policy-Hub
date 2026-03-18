import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
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
    findByEmail(@Query('email') email: string) {
        return this.ticketsService.findByEmail(email);
    }

    @Patch(':id/answer')
    answer(@Param('id') id: string, @Body('answer') answer: string) {
        return this.ticketsService.answer(id, answer);
    }
}
