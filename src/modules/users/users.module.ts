import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
