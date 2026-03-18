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
exports.SearchLogsController = void 0;
const common_1 = require("@nestjs/common");
const search_logs_service_1 = require("./search-logs.service");
let SearchLogsController = class SearchLogsController {
    searchLogsService;
    constructor(searchLogsService) {
        this.searchLogsService = searchLogsService;
    }
    log(query, resultCount) {
        return this.searchLogsService.log(query, resultCount);
    }
    getTop() {
        return this.searchLogsService.getTop();
    }
    getStats() {
        return this.searchLogsService.getStats();
    }
    getRecent() {
        return this.searchLogsService.getRecent();
    }
};
exports.SearchLogsController = SearchLogsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('query')),
    __param(1, (0, common_1.Body)('resultCount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SearchLogsController.prototype, "log", null);
__decorate([
    (0, common_1.Get)('top'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchLogsController.prototype, "getTop", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchLogsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchLogsController.prototype, "getRecent", null);
exports.SearchLogsController = SearchLogsController = __decorate([
    (0, common_1.Controller)('search-logs'),
    __metadata("design:paramtypes", [search_logs_service_1.SearchLogsService])
], SearchLogsController);
//# sourceMappingURL=search-logs.controller.js.map