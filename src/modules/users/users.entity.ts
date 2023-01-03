import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PasswordRecover } from '../auth/password-recover.entity';
import { Post } from '../posts/posts.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fullName: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'text', select: false })
    @Exclude()
    password: string;

    @Column()
    phoneNumber: string;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => PasswordRecover, (passwordRecover) => passwordRecover.user, { onDelete: 'CASCADE', cascade: true })
    passwordRecovers: PasswordRecover[];

    @OneToMany(() => Post, (post) => post.author, { onDelete: 'SET NULL', cascade: true })
    posts: Post[];

    @BeforeInsert()
    createFullName() {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }

    @Column({ nullable: true, select: false })
    salt: string;

    @BeforeInsert()
    async hashPassword() {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}
