import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { PostDto, UpdatePostDto } from './dto/posts.dto';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { PostStatus } from './posts-status.enum';
import * as dayjs from 'dayjs';
import { FilesService } from '../files/files.service';
import fetch from 'node-fetch';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly categoriesService: CategoriesService,
        private readonly tagsService: TagsService,
        private readonly usersService: UsersService,
        private readonly filesService: FilesService,
    ) {}

    async getAll(postFilterDto: PostsFilterDto): Promise<[Post[], number]> {
        try {
            const { title, authorId, tags, categories } = postFilterDto;
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

            query.select([
                'post.id',
                'post.title',
                'post.slug',
                'post.excerpt',
                'post.content',
                'post.status',
                'post.createdAt',
                'post.updatedAt',
                'post.shared',
            ]);

            query.leftJoinAndSelect('post.author', 'author');
            query.leftJoinAndSelect('post.categories', 'categories');
            query.leftJoinAndSelect('post.tags', 'tags');
            query.leftJoinAndSelect('post.files', 'files');

            // query.limit(limit);
            // query.take(limit * page);

            query.orderBy('post.createdAt', 'DESC');

            return await query.getManyAndCount();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getOne(id: number): Promise<Post> {
        try {
            return await this.postsRepository.findOne({
                where: { id },
                relations: ['author', 'categories', 'tags', 'files'],
                select: ['id', 'title', 'slug', 'excerpt', 'content', 'status', 'createdAt', 'updatedAt', 'shared'],
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
                select: ['id', 'title', 'slug', 'excerpt', 'content', 'status', 'createdAt', 'updatedAt', 'shared'],
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

    async uploadExportedPosts(exportedPosts: ExportedPosts[]): Promise<any> {
        let i = 260;

        const author = await this.usersService.findOneById(1);
        for (const exportedPost of exportedPosts) {
            const {
                Title,
                Status,
                Content,
                Excerpt,
                Date: date,
                Etiquetas: tags,
                Categorías: categories,
                'Image URL': img,
            } = exportedPost;
            if (Status === 'publish') {
                const categoriesIds = await this.categoriesService.getCategoriesList(categories.split(','));

                const post = new Post();

                post.title = Title.replace('\xFFFD', '');
                post.excerpt = Excerpt;
                post.content = Content;
                post.status = PostStatus.PUBLICADO;
                post.createdAt = dayjs(date).toDate();
                post.updatedAt = dayjs(date).toDate();
                post.author = author;
                post.categories = categoriesIds;
                if (tags) {
                    const tagsIds = await this.tagsService.getTagsList(tags.split(','));
                    post.tags = tagsIds;
                }
                if (img) {
                    const imageData = await fetch(img)
                        .then((r) => {
                            if (r.ok) {
                                return r.buffer();
                            }
                        })
                        .catch((e) => console.log(`Error on create file from post ${Title}`, e));
                    if (imageData) {
                        const imageUrl = await this.filesService.uploadImage(imageData, 'images', true);
                        const image = await this.filesService.getFilesByArrayId([imageUrl.id]);
                        post.files = image;
                    }
                }
                console.log(`Post ${Title} created ${i}`);

                await post.save();
            }
            if (i < 10) {
                this.delay(1000);
            }
            i++;
        }
    }
    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

class ExportedPosts {
    Title: string;
    Content: string;
    Excerpt: string;
    Date: Date;
    'Image URL': string;
    'Categorías': string;
    'Etiquetas': string;
    'Status': string;
}
