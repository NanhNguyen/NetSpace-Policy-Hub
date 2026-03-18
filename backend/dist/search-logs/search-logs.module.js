"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchLogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const search_logs_service_1 = require("./search-logs.service");
const search_logs_controller_1 = require("./search-logs.controller");
const search_log_entity_1 = require("./entities/search-log.entity");
let SearchLogsModule = class SearchLogsModule {
};
exports.SearchLogsModule = SearchLogsModule;
exports.SearchLogsModule = SearchLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([search_log_entity_1.SearchLog])],
        controllers: [search_logs_controller_1.SearchLogsController],
        providers: [search_logs_service_1.SearchLogsService],
    })
], SearchLogsModule);
//# sourceMappingURL=search-logs.module.js.map