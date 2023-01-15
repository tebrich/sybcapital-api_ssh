import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { slugify } from '../../utils/slugify';
import { Category } from './categories.entity';
import { CategoriesDto, UpdateCategoriesDto } from './dto/categories.dto';
import { CategoriesFilterDto } from './dto/categories-filter.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async findAll(categoriesFilter: CategoriesFilterDto): Promise<[Category[], number]> {
        try {
            const { name, limit, page, includePosts, includeDeleted } = categoriesFilter;

            const query = this.categoriesRepository.createQueryBuilder('category');

            if (name) {
                query.andWhere('category.name LIKE :name', { name: `%${name}%` });
            }

            if (includeDeleted) {
                query.withDeleted();
            }

            if (includePosts) {
                query.leftJoinAndSelect('category.posts', 'post');
            }

            query.take(limit);
            query.skip((page - 1) * limit);

            return await query.getManyAndCount();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getOne(id: number, includePosts = false): Promise<Category> {
        try {
            const query = this.categoriesRepository.createQueryBuilder('category');

            query.where('category.id = :id', { id });

            if (includePosts) {
                query.leftJoinAndSelect('category.posts', 'post');
            }

            return await query.getOne();
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async create(categoryDto: CategoriesDto): Promise<Category> {
        const { name, description, featured, parentId } = categoryDto;
        try {
            let parent = null;
            if (parentId) parent = await this.getOne(parentId);

            const category = this.categoriesRepository.create({ name, description, featured, parent });
            return await this.categoriesRepository.save(category);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async update(id: number, categoryDto: UpdateCategoriesDto): Promise<Category> {
        const { name, description, featured, parentId } = categoryDto;
        try {
            const category = await this.getOne(id);

            if (!category) {
                throw new BadRequestException(
                    { message: `Category with id ${id} not found` },
                    `Category with id ${id} not found`,
                );
            }

            if (name) {
                category.name = name;
                category.slug = slugify(name);
            }

            if (description) {
                category.description = description;
            }

            if (parentId) {
                const parent = await this.getOne(parentId);
                category.parent = parent;
            }

            if (featured) {
                category.featured = featured;
            }

            return await this.categoriesRepository.save(category);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async delete(id: number): Promise<Category> {
        try {
            const category = await this.getOne(id);

            if (!category) {
                throw new BadRequestException(
                    { message: `Category with id ${id} not found` },
                    `Category with id ${id} not found`,
                );
            }

            return await this.categoriesRepository.softRemove(category);
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getCategoriesList(categories: string[]): Promise<Category[]> {
        try {
            if (categories.length === 0) {
                throw new BadRequestException({ message: 'Categories list is empty' }, 'Categories list is empty');
            }

            const categoriesToReturn = [];
            for (const category of categories) {
                let categoryToReturn = await this.categoriesRepository.findOneBy({ name: category });

                if (!categoryToReturn) {
                    categoryToReturn = await this.create({ name: category, description: '' });
                }

                categoriesToReturn.push(categoryToReturn);
            }

            return categoriesToReturn;
        } catch (err) {
            throw new BadRequestException(err.message, err.stack);
        }
    }

    async getCategoriesForMenu(): Promise<Category[]> {
        try {
            return await this.categoriesRepository.find({
                where: { featured: true },
                relations: ['children'],
            });
        } catch (e) {
            throw new BadRequestException(e.message, e.stack);
        }
    }
}
