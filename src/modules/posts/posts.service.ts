import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { PostDto, UpdatePostDto } from './dto/posts.dto';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly categoriesService: CategoriesService,
        private readonly tagsService: TagsService,
        private readonly usersService: UsersService,
    ) {}

    async getAll(postFilterDto: PostsFilterDto): Promise<[Post[], number]> {
        try {
            const { title, authorId, tags, categories, limit, page } = postFilterDto;
            const query = this.postsRepository.createQueryBuilder('post');

            if (title) {
                query.andWhere('post.title = :title', { title: `%${title}%` });
            }

            if (authorId) {
                query.andWhere('post.author = :authorId', { authorId });
            }

            if (tags) {
                query.andWhere('post.tags IN (:tags)', { tags });
            }

            if (categories) {
                query.andWhere('post.categories IN (:categories)', { categories });
            }

            query.leftJoinAndSelect('post.author', 'author');
            query.leftJoinAndSelect('post.categories', 'categories');
            query.leftJoinAndSelect('post.tags', 'tags');

            query.limit(limit);
            query.take(limit * page);

            return await query.getManyAndCount();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getOne(id: number): Promise<Post> {
        try {
            return await this.postsRepository.findOne({
                where: { id },
                relations: ['author', 'categories', 'tags'],
                select: ['id', 'title', 'slug', 'excerpt', 'content', 'status', 'createdAt', 'updatedAt'],
            });
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getOneBySlug(slug: string): Promise<Post> {
        try {
            return await this.postsRepository.findOne({
                where: { slug },
                relations: ['author', 'categories', 'tags'],
                select: ['id', 'title', 'slug', 'excerpt', 'content', 'status', 'createdAt', 'updatedAt'],
            });
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async create(postDto: PostDto): Promise<Post> {
        const { title, excerpt, content, authorId, tags, categories, status } = postDto;
        try {
            const categoriesIds = await this.categoriesService.getCategoriesList(categories);
            const tagsIds = await this.tagsService.getTagsList(tags);
            const author = await this.usersService.findOneById(authorId);

            const post = new Post();
            post.title = title;
            post.excerpt = excerpt;
            post.content = content;
            post.author = author;
            post.categories = categoriesIds;
            post.tags = tagsIds;

            if (status) {
                post.status = status;
            }

            return post.save();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        try {
            const { title, excerpt, content, authorId, tags, categories, status } = updatePostDto;

            const post = await this.postsRepository.findOneBy({ id });

            if (!post) {
                throw new NotFoundException();
            }

            if (title) {
                post.title = title;
            }

            if (excerpt) {
                post.excerpt = excerpt;
            }

            if (content) {
                post.content = content;
            }

            if (authorId) {
                const author = await this.usersService.findOneById(authorId);
                post.author = author;
            }

            if (tags) {
                const tagsIds = await this.tagsService.getTagsList(tags);
                post.tags = tagsIds;
            }

            if (categories) {
                const categoriesIds = await this.categoriesService.getCategoriesList(categories);
                post.categories = categoriesIds;
            }

            if (status) {
                post.status = status;
            }

            return await post.save();
        } catch (err) {
            throw new InternalServerErrorException(err.message, err.stack);
        }
    }

    async delete(id: number): Promise<Post> {
        try {
            const post = await this.postsRepository.findOneBy({ id });
            return await this.postsRepository.softRemove(post);
        } catch (err) {
            throw new InternalServerErrorException(err.message, err.stack);
        }
    }
}
