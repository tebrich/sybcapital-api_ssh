import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    controllers: [PostsController],
    imports: [TypeOrmModule.forFeature([Post]), AuthModule, CategoriesModule],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
