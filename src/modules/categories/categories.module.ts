import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './categories.controller';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
    controllers: [CategoriesController],
    imports: [TypeOrmModule.forFeature([Category]), AuthModule],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
