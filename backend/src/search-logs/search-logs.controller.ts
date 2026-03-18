import { Controller, Post, Body, Get } from '@nestjs/common';
import { SearchLogsService } from './search-logs.service';

@Controller('search-logs')
export class SearchLogsController {
    constructor(private readonly searchLogsService: SearchLogsService) { }

    @Post()
    log(@Body('query') query: string, @Body('resultCount') resultCount: number) {
        return this.searchLogsService.log(query, resultCount);
    }

    @Get('top')
    getTop() {
        return this.searchLogsService.getTop();
    }

    @Get('stats')
    getStats() {
        return this.searchLogsService.getStats();
    }

    @Get('recent')
    getRecent() {
        return this.searchLogsService.getRecent();
    }
}
