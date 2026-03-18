import { FaqsService } from './faqs.service';
import { Faq } from './entities/faq.entity';
export declare class FaqsController {
    private readonly faqsService;
    constructor(faqsService: FaqsService);
    findAll(): Promise<Faq[]>;
    create(faq: Partial<Faq>): Promise<Faq>;
    update(id: string, updates: Partial<Faq>): Promise<Faq>;
    remove(id: string): Promise<void>;
}
