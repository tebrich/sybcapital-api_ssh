import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { SubscribeController } from './subscribe.controller';
import { Subscribe } from './subscribe.entity';
import { SubscribeService } from './subscribe.service';

@Module({
    imports: [TypeOrmModule.forFeature([Subscribe]), AuthModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
    exports: [SubscribeService],
})
export class SubscribeModule {}
