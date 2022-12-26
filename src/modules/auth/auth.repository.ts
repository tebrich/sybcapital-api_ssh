import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from '../users/users.entity';
import { AuthCredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.manager);
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOne({ where: { email }, select: ['email', 'password'] });

        if (user && (await user.validatePassword(password))) {
            return user.email;
        } else {
            return null;
        }
    }
}
