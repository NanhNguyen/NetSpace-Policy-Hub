import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
export declare class FaqsService {
    private faqsRepository;
    constructor(faqsRepository: Repository<Faq>);
    findAll(): Promise<Faq[]>;
    findOne(id: string): Promise<Faq>;
    create(faq: Partial<Faq>): Promise<Faq>;
    update(id: string, updates: Partial<Faq>): Promise<Faq>;
    remove(id: string): Promise<void>;
}
