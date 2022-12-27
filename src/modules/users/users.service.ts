import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/users.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    private logger = new Logger('UserService');

    async createUser(userDto: CreateUserDto): Promise<User> {
        try {
            const { password, email, firstName, lastName, phoneNumber } = userDto;
            if (password === undefined) {
                throw new BadRequestException('Password is required');
            }

            const newUser = this.userRepository.create({
                password,
                email,
                firstName,
                lastName,
                phoneNumber,
            });
            return await this.userRepository.save(newUser);
        } catch (error) {
            this.logger.error(`New error createUser ${error}`);
            if (error.errno === 1062) {
                throw new ConflictException('Email already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async findOneById(userId: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException();
            }

            return user;
        } catch (error) {
            this.logger.error(`New error findOneById ${error}`);
            throw new BadRequestException();
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.find();

            return users;
        } catch (error) {
            this.logger.error(`New error findAll ${error}`);
            throw new BadRequestException();
        }
    }
    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { email: email } });

            if (!user) {
                throw new NotFoundException('Usuario o contraseña no validos');
            }

            return user;
        } catch (error) {
            this.logger.error(`New error findByEmail ${error}`);
            throw new BadRequestException(error);
        }
    }

    decriptPassword(password: string, hashPassword: string) {
        const decrypt = compareSync(password, hashPassword);
        return decrypt;
    }
}
