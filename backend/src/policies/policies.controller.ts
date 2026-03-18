import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Policy } from './entities/policy.entity';

@Controller('policies')
export class PoliciesController {
    constructor(private readonly policiesService: PoliciesService) { }

    @Post()
    create(@Body() policy: Partial<Policy>) {
        return this.policiesService.create(policy);
    }

    @Get()
    findAll(@Query('published') published?: string) {
        const isPublished = published === 'true';
        return this.policiesService.findAll(isPublished);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.policiesService.findOne(id);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.policiesService.findBySlug(slug);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updates: Partial<Policy>) {
        return this.policiesService.update(id, updates);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.policiesService.remove(id);
    }
}
