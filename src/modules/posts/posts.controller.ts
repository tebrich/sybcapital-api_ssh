import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { PostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async findAll(@Query() postsFilterDto: PostsFilterDto) {
        return await this.postsService.getAll(postsFilterDto);
    }

    @Get('/:id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.postsService.getOne(id);
    }

    @Get('/slug/:slug')
    async getOneBySlug(@Param('slug') slug: string) {
        return await this.postsService.getOneBySlug(slug);
    }

    @UseGuards(AuthGuard())
    @Post()
    async create(@Body() postDto: PostDto) {
        return await this.postsService.create(postDto);
    }

    @UseGuards(AuthGuard())
    @Patch('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
        return await this.postsService.update(id, updatePostDto);
    }

    @UseGuards(AuthGuard())
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.postsService.delete(id);
    }

    @UseGuards(AuthGuard())
    @Post('/exported-posts/recover')
    async uploadExportedPosts(@Body() exportedPosts: any) {
        return await this.postsService.uploadExportedPosts(exportedPosts);
    }

    @UseGuards(AuthGuard())
    @Get('/exported-posts/replace-files')
    async removeOldPhotos() {
        return await this.postsService.removeOldPhotos();
    }
}
