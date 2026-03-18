"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const search_log_entity_1 = require("./entities/search-log.entity");
let SearchLogsService = class SearchLogsService {
    searchLogRepository;
    constructor(searchLogRepository) {
        this.searchLogRepository = searchLogRepository;
    }
    async log(query, resultCount) {
        const log = this.searchLogRepository.create({ query, result_count: resultCount });
        return this.searchLogRepository.save(log);
    }
    async getTop() {
        return this.searchLogRepository
            .createQueryBuilder('log')
            .select('log.query', 'query')
            .addSelect('COUNT(*)', 'count')
            .groupBy('log.query')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
    }
    async getStats() {
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
    async getRecent() {
        return this.searchLogRepository.find({
            order: { created_at: 'DESC' },
            take: 20
        });
    }
};
exports.SearchLogsService = SearchLogsService;
exports.SearchLogsService = SearchLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(search_log_entity_1.SearchLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SearchLogsService);
//# sourceMappingURL=search-logs.service.js.map