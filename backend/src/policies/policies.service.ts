import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';

@Injectable()
export class PoliciesService {
    constructor(
        @InjectRepository(Policy)
        private policiesRepository: Repository<Policy>,
    ) { }

    async create(policy: Partial<Policy>): Promise<Policy> {
        const newPolicy = this.policiesRepository.create(policy);
        return this.policiesRepository.save(newPolicy);
    }

    async findAll(published?: boolean): Promise<Policy[]> {
        if (published !== undefined) {
            return this.policiesRepository.find({ where: { published }, order: { created_at: 'DESC' } });
        }
        return this.policiesRepository.find({ order: { created_at: 'DESC' } });
    }

    async findOne(id: string): Promise<Policy> {
        const policy = await this.policiesRepository.findOne({ where: { id } });
        if (!policy) throw new NotFoundException(`Policy with ID ${id} not found`);
        return policy;
    }

    async findBySlug(slug: string): Promise<Policy> {
        const policy = await this.policiesRepository.findOne({ where: { slug } });
        if (!policy) throw new NotFoundException(`Policy with slug ${slug} not found`);
        return policy;
    }

    async update(id: string, updates: Partial<Policy>): Promise<Policy> {
        await this.policiesRepository.update(id, updates);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.policiesRepository.delete(id);
    }
}
