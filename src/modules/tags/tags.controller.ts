import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { CreateTagDto } from './dto/tags.dto';
import { TagsFilter } from './dto/tags-filter';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@UseGuards(AuthGuard())
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @Get()
    async findAll(
        @Query()
        tagsFilter: TagsFilter,
    ) {
        return await this.tagsService.findAll(tagsFilter);
    }

    @Get('/:id')
    async findOne(@Param('id') id: number, @Query('inlcudePost') inlcudePost = false) {
        return await this.tagsService.findOne(id, inlcudePost);
    }

    @Post()
    async create(@Body() tagDto: CreateTagDto) {
        return await this.tagsService.create(tagDto);
    }

    @Patch('/:id')
    async update(@Param('id') id: number, @Body() tagDto: CreateTagDto) {
        return await this.tagsService.update(id, tagDto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        return await this.tagsService.delete(id);
    }

    @Post('/list')
    async getTagsList(@Body() tags: string[]) {
        return await this.tagsService.getTagsList(tags);
    }
}
