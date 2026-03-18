import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
export declare class PoliciesService {
    private policiesRepository;
    constructor(policiesRepository: Repository<Policy>);
    create(policy: Partial<Policy>): Promise<Policy>;
    findAll(published?: boolean): Promise<Policy[]>;
    findOne(id: string): Promise<Policy>;
    findBySlug(slug: string): Promise<Policy>;
    update(id: string, updates: Partial<Policy>): Promise<Policy>;
    remove(id: string): Promise<void>;
}
