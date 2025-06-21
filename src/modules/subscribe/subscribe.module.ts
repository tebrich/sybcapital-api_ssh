import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '../../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { SubscribeController } from './subscribe.controller';
import { Subscribe } from './subscribe.entity';
import { SubscribeService } from './subscribe.service';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([Subscribe]), AuthModule, MailerModule, EmailModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
    exports: [SubscribeService],
})
export class SubscribeModule {}

