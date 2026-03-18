import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { Faq } from './entities/faq.entity';

@Controller('faqs')
export class FaqsController {
    constructor(private readonly faqsService: FaqsService) { }

    @Get()
    findAll() {
        return this.faqsService.findAll();
    }

    @Post()
    create(@Body() faq: Partial<Faq>) {
        return this.faqsService.create(faq);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updates: Partial<Faq>) {
        return this.faqsService.update(id, updates);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.faqsService.remove(id);
    }
}
