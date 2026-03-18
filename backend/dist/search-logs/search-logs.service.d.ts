import { Repository } from 'typeorm';
import { SearchLog } from './entities/search-log.entity';
export declare class SearchLogsService {
    private searchLogRepository;
    constructor(searchLogRepository: Repository<SearchLog>);
    log(query: string, resultCount: number): Promise<SearchLog>;
    getTop(): Promise<any[]>;
    getStats(): Promise<any>;
    getRecent(): Promise<SearchLog[]>;
}
