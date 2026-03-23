import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword } from './entities/keyword.entity';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    const newKeyword = this.keywordRepository.create({
      ...createKeywordDto,
      isActive: createKeywordDto.isActive ?? true,
      order: createKeywordDto.order ?? 0,
    });
    return this.keywordRepository.save(newKeyword);
  }

  async findAll(): Promise<Keyword[]> {
    return this.keywordRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findActive(): Promise<Keyword[]> {
    return this.keywordRepository.find({
      where: { isActive: true },
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Keyword> {
    const keyword = await this.keywordRepository.findOneBy({ id });
    if (!keyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }
    return keyword;
  }

  async update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<Keyword> {
    const keyword = await this.findOne(id);
    Object.assign(keyword, updateKeywordDto);
    return this.keywordRepository.save(keyword);
  }

  async remove(id: string): Promise<void> {
    const keyword = await this.findOne(id);
    await this.keywordRepository.remove(keyword);
  }

  async reorder(orderedIds: string[]): Promise<Keyword[]> {
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
}
