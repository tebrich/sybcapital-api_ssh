import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FilesModule } from './modules/files/files.module';
import { PostsModule } from './modules/posts/posts.module';
import { StockPricesModule } from './modules/stock-prices/stock-prices.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        UsersModule,
        AuthModule,
        PostsModule,
        CategoriesModule,
        TagsModule,
        FilesModule,
        StockPricesModule,
    ],
})
export class AppModule {}
