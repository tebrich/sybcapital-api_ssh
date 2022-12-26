import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/users.entity';

@Entity()
export class PasswordRecover extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.passwordRecovers, { eager: true })
    @JoinColumn({ name: 'users_id' })
    user: User;

    @Column()
    @Generated('uuid')
    link: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
