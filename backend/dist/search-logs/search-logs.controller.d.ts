import { SearchLogsService } from './search-logs.service';
export declare class SearchLogsController {
    private readonly searchLogsService;
    constructor(searchLogsService: SearchLogsService);
    log(query: string, resultCount: number): Promise<import("./entities/search-log.entity").SearchLog>;
    getTop(): Promise<any[]>;
    getStats(): Promise<any>;
    getRecent(): Promise<import("./entities/search-log.entity").SearchLog[]>;
}
