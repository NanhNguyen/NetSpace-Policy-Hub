import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchLog } from './entities/search-log.entity';

@Injectable()
export class SearchLogsService {
    constructor(
        @InjectRepository(SearchLog)
        private searchLogRepository: Repository<SearchLog>,
    ) { }

    async log(query: string, resultCount: number): Promise<SearchLog> {
        const log = this.searchLogRepository.create({ query, result_count: resultCount });
        return this.searchLogRepository.save(log);
    }

    async getTop(): Promise<any[]> {
        return this.searchLogRepository
            .createQueryBuilder('log')
            .select('log.query', 'query')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.query')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async getStats(): Promise<any> {
        const total = await this.searchLogRepository.count();
        const zeroResults = await this.searchLogRepository.count({ where: { result_count: 0 } });
        const recentCount = await this.searchLogRepository
            .createQueryBuilder('log')
            .where('log.created_at > :date', { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) })
            .getCount();

        return {
            total,
            zeroResults,
            last30Days: recentCount
        };
    }

    async getRecent(): Promise<SearchLog[]> {
        return this.searchLogRepository.find({
            order: { created_at: 'DESC' },
            take: 20
        });
    }
}
