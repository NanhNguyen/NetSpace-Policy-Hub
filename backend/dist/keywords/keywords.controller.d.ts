import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
export declare class KeywordsController {
    private readonly keywordsService;
    constructor(keywordsService: KeywordsService);
    create(createKeywordDto: CreateKeywordDto): Promise<import("./entities/keyword.entity").Keyword>;
    findAll(): Promise<import("./entities/keyword.entity").Keyword[]>;
    findActive(): Promise<import("./entities/keyword.entity").Keyword[]>;
    findOne(id: string): Promise<import("./entities/keyword.entity").Keyword>;
    update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<import("./entities/keyword.entity").Keyword>;
    remove(id: string): Promise<void>;
    reorder(orderedIds: string[]): Promise<import("./entities/keyword.entity").Keyword[]>;
}
