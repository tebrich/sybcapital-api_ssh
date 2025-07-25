import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContactModule } from './modules/contact/contact.module';
import { FilesModule } from './modules/files/files.module';
import { PostsModule } from './modules/posts/posts.module';
import { StockPricesModule } from './modules/stock-prices/stock-prices.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';
import { EmailService } from './modules/email/email.service';

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
        MailerModule,
        SubscribeModule,
        ContactModule,           
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class AppModule {}
