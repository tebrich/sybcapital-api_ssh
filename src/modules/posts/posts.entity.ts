import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import { Category } from '../categories/categories.entity';
import { Tag } from '../tags/tags.entity';
import { User } from '../users/users.entity';
import { PostStatus } from './posts-status.enum';

@Entity()
@Unique(['slug'])
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    slug: string;

    @Column()
    excerpt: string;

    @Column({ type: 'mediumtext' })
    content: string;

    @ManyToOne(() => User, (user) => user.posts, { eager: false })
    author: User;

    @ManyToMany(() => Category, { eager: false, cascade: ['soft-remove', 'remove'], onDelete: 'RESTRICT' })
    @JoinTable({ name: 'post_categories' })
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.posts, {
        eager: false,
        cascade: ['soft-remove', 'remove'],
        onDelete: 'RESTRICT',
    })
    @JoinTable({ name: 'post_tags' })
    tags: Tag[];

    @Column({ type: 'enum', enum: PostStatus, default: PostStatus.BORRADOR })
    status: PostStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    slugify() {
        this.slug = this.title
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s/g, '-')
            .toLowerCase();
    }
}
