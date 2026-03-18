import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqsService {
    constructor(
        @InjectRepository(Faq)
        private faqsRepository: Repository<Faq>,
    ) { }

    findAll(): Promise<Faq[]> {
        return this.faqsRepository.find({ order: { order_index: 'ASC' } });
    }

    async findOne(id: string): Promise<Faq> {
        const faq = await this.faqsRepository.findOne({ where: { id } });
        if (!faq) throw new NotFoundException('FAQ not found');
        return faq;
    }

    create(faq: Partial<Faq>): Promise<Faq> {
        const newFaq = this.faqsRepository.create(faq);
        return this.faqsRepository.save(newFaq);
    }

    async update(id: string, updates: Partial<Faq>): Promise<Faq> {
        await this.faqsRepository.update(id, updates);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.faqsRepository.delete(id);
    }
}
