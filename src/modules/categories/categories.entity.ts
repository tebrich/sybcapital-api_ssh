import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import * as Slugify from '../../utils/slugify';
import { Post } from '../posts/posts.entity';

@Entity()
@Unique(['slug'])
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    description: string;

    @ManyToMany(() => Post, (post) => post.categories)
    posts: Post[];

    @Column({ default: false })
    featured: boolean;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    slugify() {
        this.slug = Slugify.slugify(this.name);
    }
}
