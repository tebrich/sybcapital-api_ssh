import { Body, Controller, Post, Get, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../users/dto/users.dto';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('/register')
    async createUser(
        @Body() userDto: CreateUserDto
    ): Promise<User> {
        return await this.usersService.createUser(userDto);
    }

    @Post('/login')
    login(
        @Body(ValidationPipe) authCredentials: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.login(authCredentials);
    }

    // Endpoint para obtener perfil del usuario autenticado
    @UseGuards(JwtAuthGuard)
    @Get('/me')
    getProfile(
        @Request() req
    ): { data: any } {
        return { data: req.user };
    }
}

