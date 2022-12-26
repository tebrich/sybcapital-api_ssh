import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { slugify } from '../../utils/slugify';
import { CreateTagDto, UpdateTagDto } from './dto/tags.dto';
import { TagsFilter } from './dto/tags-filter';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async findAll(tagsFilter: TagsFilter): Promise<[Tag[], number]> {
        try {
            const query = this.tagRepository.createQueryBuilder('tag');

            if (tagsFilter.name) {
                query.andWhere('tag.name LIKE :name', { name: `%${tagsFilter.name}%` });
            }

            query.limit(tagsFilter.limit);
            query.take(tagsFilter.limit * tagsFilter.page);

            if (tagsFilter.inlcudeDeleted) {
                query.withDeleted();
            }

            if (tagsFilter.includePosts) {
                query.innerJoinAndSelect('tag.posts', 'post');
            }

            return await query.getManyAndCount();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async findOne(id: number, inlcudePost = false): Promise<Tag> {
        try {
            const tag = this.tagRepository.createQueryBuilder('tag').where('tag.id = :id', { id });

            if (inlcudePost) {
                tag.innerJoinAndSelect('tag.posts', 'post');
            }

            if (!tag) {
                throw new BadRequestException(
                    { message: `Tag with id ${id} not found` },
                    `Tag with id ${id} not found`,
                );
            }

            return await tag.getOne();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async create(tag: CreateTagDto): Promise<Tag> {
        const { name } = tag;

        try {
            const newTag = await this.tagRepository.create({ name });
            return await this.tagRepository.save(newTag);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async update(id: number, tag: UpdateTagDto): Promise<Tag> {
        try {
            const tagToUpdate = await this.tagRepository.findOneBy({ id });
            if (!tagToUpdate) {
                throw new BadRequestException(
                    { message: `Tag with id ${id} not found` },
                    `Tag with id ${id} not found`,
                );
            }

            if (tag.name) {
                tagToUpdate.name = tag.name;
                tagToUpdate.slug = slugify(tag.name);
            }

            return await this.tagRepository.save(tagToUpdate);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async delete(id: number): Promise<Tag> {
        try {
            const tagToDelete = await this.tagRepository.findOneBy({ id });
            if (!tagToDelete) {
                throw new BadRequestException(
                    { message: `Tag with id ${id} not found` },
                    `Tag with id ${id} not found`,
                );
            }

            return await this.tagRepository.softRemove(tagToDelete);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getTagsList(tags: string[]): Promise<Tag[]> {
        try {
            if (tags.length === 0) {
                throw new BadRequestException({ message: 'Tags list is empty' }, 'Tags list is empty');
            }

            const tagsToReturn = [];
            for (const tag of tags) {
                let tagToReturn = await this.tagRepository.findOneBy({ name: tag });

                if (!tagToReturn) {
                    tagToReturn = await this.create({ name: tag });
                }

                tagsToReturn.push(tagToReturn);
            }

            return tagsToReturn;
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }
}
