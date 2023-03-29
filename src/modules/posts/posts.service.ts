import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { MailerService } from '@nestjs-modules/mailer';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { IsNull, Like, Repository } from 'typeorm';

import * as Slugify from '../../utils/slugify';
import { CategoriesService } from '../categories/categories.service';
import { FilesService } from '../files/files.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { PostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { Post } from './posts.entity';
import { PostStatus } from './posts-status.enum';
// import { SubscribeService } from '../subscribe/subscribe.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
        private readonly categoriesService: CategoriesService,
        private readonly tagsService: TagsService,
        private readonly usersService: UsersService,
        private readonly filesService: FilesService, // private mailerService: MailerService, // private subscriberService: SubscribeService,
    ) {}

    async getAll(postFilterDto: PostsFilterDto): Promise<[Post[], number]> {
        try {
            const { title, authorId, tags, categories, limit, page, status } = postFilterDto;
            const query = this.postsRepository.createQueryBuilder('post');

            if (title) {
                query.andWhere('post.title like :title', { title: `%${title}%` });
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

            if (status) {
                query.andWhere('post.status = :status', { status });
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

            query.take(limit);
            query.skip(limit * (page - 1));

            query.orderBy('post.createdAt', 'DESC');

            return await query.getManyAndCount();
        } catch (err) {
            console.log(err);
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
        const { title, excerpt, content, authorId, tags, categories, status, files } = postDto;
        try {
            const categoriesIds = await this.categoriesService.getCategoriesList(categories);
            const tagsIds = await this.tagsService.getTagsList(tags);
            const author = await this.usersService.findOneById(authorId);
            const filesId = await this.filesService.getFilesByArrayId([files]);

            const post = new Post();
            post.title = title;
            post.excerpt = excerpt;
            post.content = content;
            post.author = author;
            post.categories = categoriesIds;
            post.tags = tagsIds;
            post.files = filesId;

            if (status) {
                post.status = status;
            }

            // const subscribers = await this.subscriberService.getAllActive();
            // for (const subscriber of subscribers) {
            //     await this.mailerService.sendMail({
            //         to: subscriber.email,
            //         subject: '¡Nuevo post en el blog! - SyB Capital',
            //         template: 'new-post',
            //         context: {
            //             title: title,
            //             postImage: filesId[0].url,
            //             excerpt: excerpt,
            //             postLink: `https://sybcapital.com/post/${Slugify.slugify(title)}`,
            //         },
            //     });
            // }

            return post.save();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        try {
            const { title, excerpt, content, authorId, tags, categories, status, files } = updatePostDto;

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

            if (files) {
                const filesId = await this.filesService.getFilesByArrayId([files]);
                post.files = filesId;
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

    async updateShared(id: number, shared: string): Promise<Post> {
        try {
            const post = await this.postsRepository.findOneBy({ id });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            console.log(post.shared);
            const oldSharedValue = post.shared[shared];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            post.shared = { ...post.shared, [shared]: oldSharedValue + 1 };

            return await post.save();
        } catch (e) {
            throw new InternalServerErrorException('Error update shared', e.stack);
        }
    }

    async uploadExportedPosts(exportedPosts: ExportedPosts[]): Promise<any> {
        let i = 1;

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

            const tempSlug = Slugify.slugify(Title.replace('\xFFFD', ''));

            const similarPost = await this.postsRepository
                .createQueryBuilder('post')
                .where('post.slug like :slug', { slug: `%${tempSlug.slice(1, 30)}%` })
                .getOne();

            if (Status === 'publish' && !similarPost) {
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
                await this.postsRepository.createQueryBuilder().insert().into(Post).values(post).execute();
            }

            if (i % 10 === 0) {
                await this.delay(1000);
            }
            i++;
        }
    }
    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async removeOldPhotos() {
        try {
            const [posts, count] = await this.postsRepository.findAndCount({
                where: { content: Like('%https://sybcapital.com/wp-content/uploads%') },
                select: ['id', 'title', 'content'],
            });

            const urlRegex = /(https?:\/\/sybcapital.com\/wp-content[^\s]+)/g;
            for (const post of posts) {
                const urls = post.content.match(urlRegex);

                for (const url of urls) {
                    const imageData = await fetch(url).then((r) => {
                        if (r.ok) {
                            return r.buffer();
                        }
                    });
                    if (imageData) {
                        const imageUrl = await this.filesService.uploadImage(imageData, 'images', false);
                        post.content = post.content.replace(url, imageUrl.filePath);
                        console.log(`Post ${post.title} updated with old image ${url} to ${imageUrl.filePath}`);
                    }
                    await post.save();
                }
                await this.delay(1000);
            }

            return count;
        } catch (err) {
            new InternalServerErrorException(err);
        }
    }

    async updatePostPhotos(postsList: ExportedPosts[]) {
        try {
            const posts = await this.postsRepository.find({
                where: { files: { id: IsNull() } },
                relations: ['files'],
            });

            for (const post of posts) {
                const postList = postsList.find((p) => p.Title === post.title);

                if (postList) {
                    const { 'Image URL': url } = postList;

                    if (url) {
                        let urlPath = url.replace('https://sybcapital.com/wp-content/', './');
                        const searchPosition = urlPath.search(/https:/);
                        console.log(searchPosition);
                        if (searchPosition > 0) {
                            urlPath = urlPath.slice(0, searchPosition - 1);
                        }

                        console.log(urlPath);

                        const file = fs.readFileSync(urlPath);

                        if (file) {
                            const imageUrl = await this.filesService.uploadImage(file, 'images', true);
                            post.files = await this.filesService.getFilesByArrayId([imageUrl.id]);
                            console.log(`Post ${post.title} updated with old image ${url} to ${imageUrl.filePath}`);
                        }
                        await post.save();
                    }
                }
            }

            return posts;
        } catch (e) {
            throw new InternalServerErrorException('Error update post photos', e.message);
        }
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
