import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CategoriesDto, UpdateCategoriesDto } from './dto/categories.dto';
import { CategoriesFilterDto } from './dto/categories-filter.dto';

@UseGuards(AuthGuard())
@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll(@Query() categoriesFilter: CategoriesFilterDto) {
        return await this.categoriesService.findAll(categoriesFilter);
    }

    @Get('/:id')
    async getOne(@Param('id', ParseIntPipe) id: number, @Query('includePosts') includePosts = false) {
        return await this.categoriesService.getOne(id, includePosts);
    }

    @Post()
    async create(@Body() categoryDto: CategoriesDto) {
        return await this.categoriesService.create(categoryDto);
    }

    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() categoryDto: UpdateCategoriesDto) {
        return await this.categoriesService.update(id, categoryDto);
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.delete(id);
    }

    @Get('/list')
    async getCategoriesList(@Body() categoriesFilter: string[]) {
        return await this.categoriesService.getCategoriesList(categoriesFilter);
    }
}
