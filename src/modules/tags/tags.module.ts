import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { TagsController } from './tags.controller';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';

@Module({
    controllers: [TagsController],
    imports: [TypeOrmModule.forFeature([Tag]), AuthModule],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
