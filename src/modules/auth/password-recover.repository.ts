import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '../users/users.entity';
import { PasswordRecover } from './password-recover.entity';

@EntityRepository(PasswordRecover)
export class PasswordRecoverRepository extends Repository<PasswordRecover> {
    async validateLink(link: string): Promise<User> {
        const found = await this.findOne({ where: { link } });
        if (!found) {
            throw new NotFoundException('Link not found for password');
        }
        return found.user;
    }
}
