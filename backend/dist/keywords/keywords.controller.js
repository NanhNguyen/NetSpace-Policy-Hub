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
exports.KeywordsController = void 0;
const common_1 = require("@nestjs/common");
const keywords_service_1 = require("./keywords.service");
const create_keyword_dto_1 = require("./dto/create-keyword.dto");
const update_keyword_dto_1 = require("./dto/update-keyword.dto");
let KeywordsController = class KeywordsController {
    keywordsService;
    constructor(keywordsService) {
        this.keywordsService = keywordsService;
    }
    create(createKeywordDto) {
        return this.keywordsService.create(createKeywordDto);
    }
    findAll() {
        return this.keywordsService.findAll();
    }
    findActive() {
        return this.keywordsService.findActive();
    }
    findOne(id) {
        return this.keywordsService.findOne(id);
    }
    update(id, updateKeywordDto) {
        return this.keywordsService.update(id, updateKeywordDto);
    }
    remove(id) {
        return this.keywordsService.remove(id);
    }
    reorder(orderedIds) {
        return this.keywordsService.reorder(orderedIds);
    }
};
exports.KeywordsController = KeywordsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_keyword_dto_1.CreateKeywordDto]),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_keyword_dto_1.UpdateKeywordDto]),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('reorder'),
    __param(0, (0, common_1.Body)('orderedIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], KeywordsController.prototype, "reorder", null);
exports.KeywordsController = KeywordsController = __decorate([
    (0, common_1.Controller)('keywords'),
    __metadata("design:paramtypes", [keywords_service_1.KeywordsService])
], KeywordsController);
//# sourceMappingURL=keywords.controller.js.map