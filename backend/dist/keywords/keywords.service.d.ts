import { Repository } from 'typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword } from './entities/keyword.entity';
export declare class KeywordsService {
    private readonly keywordRepository;
    constructor(keywordRepository: Repository<Keyword>);
    create(createKeywordDto: CreateKeywordDto): Promise<Keyword>;
    findAll(): Promise<Keyword[]>;
    findActive(): Promise<Keyword[]>;
    findOne(id: string): Promise<Keyword>;
    update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<Keyword>;
    remove(id: string): Promise<void>;
    reorder(orderedIds: string[]): Promise<Keyword[]>;
}
