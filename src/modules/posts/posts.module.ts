import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '../../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { FilesModule } from '../files/files.module';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
    controllers: [PostsController],
    imports: [
        TypeOrmModule.forFeature([Post]),
        AuthModule,
        CategoriesModule,
        TagsModule,
        UsersModule,
        FilesModule,
        MailerModule,
        SubscribeModule,
    ],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
