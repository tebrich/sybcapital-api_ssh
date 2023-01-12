import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { User } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@UseGuards(AuthGuard())
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAllUser(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Get('/me')
    getMe(@Request() req) {
        return { data: req.user };
    }
}
