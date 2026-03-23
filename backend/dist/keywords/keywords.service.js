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
exports.KeywordsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const keyword_entity_1 = require("./entities/keyword.entity");
let KeywordsService = class KeywordsService {
    keywordRepository;
    constructor(keywordRepository) {
        this.keywordRepository = keywordRepository;
    }
    async create(createKeywordDto) {
        const newKeyword = this.keywordRepository.create({
            ...createKeywordDto,
            isActive: createKeywordDto.isActive ?? true,
            order: createKeywordDto.order ?? 0,
        });
        return this.keywordRepository.save(newKeyword);
    }
    async findAll() {
        return this.keywordRepository.find({
            order: {
                order: 'ASC',
                createdAt: 'DESC',
            },
        });
    }
    async findActive() {
        return this.keywordRepository.find({
            where: { isActive: true },
            order: {
                order: 'ASC',
                createdAt: 'DESC',
            },
        });
    }
    async findOne(id) {
        const keyword = await this.keywordRepository.findOneBy({ id });
        if (!keyword) {
            throw new common_1.NotFoundException(`Keyword with ID ${id} not found`);
        }
        return keyword;
    }
    async update(id, updateKeywordDto) {
        const keyword = await this.findOne(id);
        Object.assign(keyword, updateKeywordDto);
        return this.keywordRepository.save(keyword);
    }
    async remove(id) {
        const keyword = await this.findOne(id);
        await this.keywordRepository.remove(keyword);
    }
    async reorder(orderedIds) {
        const keywords = await this.keywordRepository.find();
        for (let i = 0; i < orderedIds.length; i++) {
            const keyword = keywords.find(k => k.id === orderedIds[i]);
            if (keyword) {
                keyword.order = i;
                await this.keywordRepository.save(keyword);
            }
        }
        return this.findAll();
    }
};
exports.KeywordsService = KeywordsService;
exports.KeywordsService = KeywordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(keyword_entity_1.Keyword)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeywordsService);
//# sourceMappingURL=keywords.service.js.map