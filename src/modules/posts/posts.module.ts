import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';

@Module({
    controllers: [PostsController],
    imports: [TypeOrmModule.forFeature([Post]), AuthModule, CategoriesModule, TagsModule, UsersModule, FilesModule],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
