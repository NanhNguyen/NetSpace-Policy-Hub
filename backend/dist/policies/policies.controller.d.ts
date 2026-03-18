import { PoliciesService } from './policies.service';
import { Policy } from './entities/policy.entity';
export declare class PoliciesController {
    private readonly policiesService;
    constructor(policiesService: PoliciesService);
    create(policy: Partial<Policy>): Promise<Policy>;
    findAll(published?: string): Promise<Policy[]>;
    findOne(id: string): Promise<Policy>;
    findBySlug(slug: string): Promise<Policy>;
    update(id: string, updates: Partial<Policy>): Promise<Policy>;
    remove(id: string): Promise<void>;
}
